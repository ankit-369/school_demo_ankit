"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilePicker } from "@/components/ui/file-picker";
import { FormField } from "@/components/ui/form-field";
import { downloadCsv } from "@/lib/csv";
import { parseCsv } from "@/lib/csv-parse";
import { sampleTemplateCsv } from "@/lib/import/sample-template";

export type ParsedCsv = { fileName: string; headers: string[]; rows: string[][] };

const MAX_ROWS = 1000;

export function UploadStep({ onParsed }: { onParsed: (csv: ParsedCsv) => void }) {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState<string>();
  const [parsed, setParsed] = useState<ParsedCsv>();

  async function onFile(f?: File) {
    setFile(f);
    setParsed(undefined);
    setError(undefined);
    if (!f) return;
    if (!/\.csv$/i.test(f.name)) return setError("Choose a .csv file — in Excel, use File → Save As → CSV.");
    const [headers, ...rows] = parseCsv(await f.text());
    if (!headers || rows.length === 0) return setError("That file has no student rows under the header row.");
    if (rows.length > MAX_ROWS) return setError(`Up to ${MAX_ROWS} students per import — split the file and import in batches.`);
    setParsed({ fileName: f.name, headers: headers.map((h) => h.trim()), rows });
  }

  return (
    <div className="flex flex-col gap-5">
      <FormField label="Student list" htmlFor="import-file" error={error} hint="One row per student, with a header row. Excel and Google Sheets can both export CSV.">
        <FilePicker id="import-file" accept=".csv,text/csv" noun="a CSV file" file={file} error={error} onChange={onFile} />
      </FormField>
      <div className="flex flex-col gap-3 rounded-lg bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">Not sure about the format? Start from the template — it lists every column the importer understands.</p>
        <Button variant="outline" className="shrink-0 border-line bg-canvas" onClick={() => downloadCsv("healthconnect-student-import-template.csv", sampleTemplateCsv())}>
          <Download aria-hidden />
          Sample template
        </Button>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line pt-4">
        <p className="text-sm text-ink-soft" aria-live="polite">
          {parsed ? `${parsed.rows.length} rows and ${parsed.headers.length} columns found` : "No file chosen yet"}
        </p>
        <Button disabled={!parsed} onClick={() => parsed && onParsed(parsed)}>
          Continue to mapping
        </Button>
      </div>
    </div>
  );
}
