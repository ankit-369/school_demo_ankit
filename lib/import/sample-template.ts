import { toCsv } from "@/lib/csv";

/** Downloadable starter file: every column the importer understands, with realistic rows. */
export function sampleTemplateCsv() {
  return toCsv(
    ["Name", "Date of birth", "Gender", "Class", "Division", "Roll no", "Blood group", "Height (cm)", "Weight (kg)", "Guardian name", "Relation", "Guardian phone", "House", "Transport", "Allergies", "Conditions", "Notes"],
    [
      ["Riya Kulkarni", "2016-04-12", "Female", "5", "A", 21, "B+", 138, 31, "Asha Kulkarni", "Mother", "+91 98201 55012", "Kaveri", "School bus", "Peanuts", "", ""],
      ["Omkar Jadhav", "14/09/2013", "Male", "Grade 8", "B", 30, "O+", 157, 46, "Sanjay Jadhav", "Father", "+91 98201 55013", "Ganga", "Walker", "", "Asthma", "Inhaler in bag"],
      ["Fatima Shaikh", "2019-01-30", "F", "2", "B", 14, "A-", 121, 22, "Rukhsar Shaikh", "Mother", "+91 98201 55014", "", "", "Penicillin; Dust mites", "", ""],
    ],
  );
}
