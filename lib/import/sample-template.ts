import { toCsv } from "@/lib/csv";
import { DEMO_PHONE } from "@/lib/config";

/**
 * Downloadable starter file: every column the importer understands. The last
 * two rows are deliberately wrong (a missing blood group, an invalid grade)
 * so the review-and-fix step has something to demonstrate.
 */
export function sampleTemplateCsv() {
  return toCsv(
    ["Name", "Date of birth", "Gender", "Class", "Division", "Roll no", "Blood group", "Height (cm)", "Weight (kg)", "Allergies", "Conditions", "Guardian name", "Guardian phone"],
    [
      ["Riya Kulkarni", "2016-04-12", "Female", "5", "A", 21, "B+", 138, 31, "Peanuts", "", "Asha Kulkarni", DEMO_PHONE],
      ["Omkar Jadhav", "14/09/2013", "Male", "Grade 8", "B", 30, "O+", 157, 46, "", "Asthma", "Sanjay Jadhav", DEMO_PHONE],
      ["Fatima Shaikh", "2019-01-30", "F", "2", "B", 14, "A-", 121, 22, "Penicillin; Dust mites", "", "Rukhsar Shaikh", DEMO_PHONE],
      ["Aditya Verma", "2015-11-02", "Male", "6", "A", 27, "", 132, 29, "", "", "Neha Verma", DEMO_PHONE],
      ["Sara Nair", "2017-06-18", "Female", "Grade 15", "A", 9, "AB+", 128, 26, "Shellfish", "", "Meera Nair", DEMO_PHONE],
    ],
  );
}
