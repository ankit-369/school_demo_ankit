import type { Metadata } from "next";
import { NotesTab } from "../_components/notes/notes-tab";

export const metadata: Metadata = { title: "Notes" };

export default function StudentNotesPage() {
  return <NotesTab />;
}
