import {
  ArrowUpCircle,
  ClipboardList,
  MessageCircle,
  Stethoscope,
  Tent,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@/lib/types/role";

export type GuideStep = {
  text: string;
  /** Present when this step should show a "Go" button that sets the role and navigates. */
  go?: { role: Role; href: string; label: string };
};

export type Flow = {
  id: number;
  title: string;
  /** One line, shown collapsed. */
  benefit: string;
  roles: Role[];
  quick: boolean;
  why: string;
  steps: GuideStep[];
  /** The "You should see" callout. */
  result: string;
  goodToKnow?: string;
};

export type Stage = {
  id: string;
  label: string;
  icon: LucideIcon;
  role: Role;
  /** Which feature card this node scrolls to. */
  flowId: number;
};

/** The 6-stage "big picture" arrow diagram. */
export const STAGES: Stage[] = [
  { id: "add", label: "Add students", icon: UserPlus, role: "admin", flowId: 2 },
  { id: "records", label: "Build records", icon: ClipboardList, role: "admin", flowId: 4 },
  { id: "visit", label: "Medical visit", icon: Stethoscope, role: "nurse", flowId: 5 },
  { id: "inform", label: "Inform guardian", icon: MessageCircle, role: "teacher", flowId: 5 },
  { id: "camps", label: "Health camps", icon: Tent, role: "admin", flowId: 6 },
  { id: "promote", label: "Year-end promotion", icon: ArrowUpCircle, role: "admin", flowId: 8 },
];

const HERO_STUDENT = "stu-16"; // Alex Bennett, 8-B — hfiles.in connected, has notes and reports.

export const FLOWS: Flow[] = [
  {
    id: 1,
    title: "Dashboard at a glance",
    benefit: "See the whole school's health status in one glance.",
    roles: ["admin"],
    quick: true,
    why: "One screen answers “is everything okay?” for the whole school.",
    steps: [
      { text: "Open the dashboard.", go: { role: "admin", href: "/admin/dashboard", label: "Open dashboard" } },
      { text: "Click the Medical Conditions tile." },
      { text: "Click Peanuts in the list.", go: { role: "admin", href: "/admin/insights/conditions?condition=Peanuts&kind=allergy", label: "See peanut allergies" } },
    ],
    result: "Every student with that allergy, grouped and filterable.",
    goodToKnow: "Every tile on the dashboard drills down the same way.",
  },
  {
    id: 2,
    title: "Add a student with health details",
    benefit: "Bring a new student in with full health details on day one.",
    roles: ["admin"],
    quick: false,
    why: "New admissions need medical details recorded straight away, not later.",
    steps: [
      { text: "Open Students, then click Add student.", go: { role: "admin", href: "/admin/students", label: "Open Students" } },
      { text: "Fill in blood group and allergies, in the Health section." },
      { text: "Save — you're offered a link straight to the new profile." },
    ],
    result: "Everything you entered, laid out on the new profile.",
    goodToKnow: "Photo, vision per eye and an emergency contact are optional too.",
  },
  {
    id: 3,
    title: "Bulk import from CSV",
    benefit: "Bring in a whole class list from a spreadsheet in minutes.",
    roles: ["admin"],
    quick: false,
    why: "Admissions season means dozens of new students, not one at a time.",
    steps: [
      { text: "Open Import, then download the sample file.", go: { role: "admin", href: "/admin/students/import", label: "Open Import" } },
      { text: "Upload it back — two rows are deliberately broken." },
      { text: "Fix the wrong cell, and delete the other row, right in the table." },
      { text: "Confirm the import." },
    ],
    result: "The new students appear in the directory immediately.",
  },
  {
    id: 4,
    title: "One profile, two sources",
    benefit: "See the school's records and the family's hfiles.in side by side.",
    roles: ["admin", "nurse"],
    quick: true,
    why: "Two sources, never merged, so no one mistakes one for the other.",
    steps: [
      { text: "Open a student, then Medical history.", go: { role: "admin", href: `/admin/students/${HERO_STUDENT}/medical-history`, label: "Open medical history" } },
      { text: "Compare School records (editable) with hfiles.in data (teal, read-only)." },
      { text: "Click Sync from hfiles.in." },
      { text: "Upload a report.", go: { role: "admin", href: `/admin/students/${HERO_STUDENT}/reports`, label: "Open reports" } },
    ],
    result: "A “synced to hfiles.in” confirmation appears. And every field you see, on any student, can be edited in place — nothing here is locked.",
  },
  {
    id: 5,
    title: "Medical room visit → guardian informed",
    benefit: "A nurse's visit reaches the right guardian, with proof it was sent.",
    roles: ["nurse", "teacher"],
    quick: true,
    why: "No visit should go unmentioned to a family, or unrecorded.",
    steps: [
      { text: "As the nurse, add a visit note for a student.", go: { role: "nurse", href: `/admin/students/${HERO_STUDENT}/notes`, label: "Add a visit note" } },
      { text: "Switch to Teacher, open Visits to share.", go: { role: "teacher", href: "/teacher/class", label: "Open Visits to share" } },
      { text: "Click Notify guardian." },
      { text: "Open the Notifications log.", go: { role: "admin", href: "/admin/notifications-log", label: "Open Notifications log" } },
    ],
    result: "Status moves from Waiting to Notified, and a log row shows exactly who sent it.",
  },
  {
    id: 6,
    title: "Health camp, start to finish",
    benefit: "Run a whole health camp without a phone call to the doctor.",
    roles: ["admin", "doctor"],
    quick: true,
    why: "Visiting doctors need somewhere to enter results, not a login to remember.",
    steps: [
      { text: "Open a camp already in progress.", go: { role: "admin", href: "/admin/camps/camp-02", label: "Open the camp" } },
      { text: "Open the ENT screening, then Doctor link.", go: { role: "admin", href: "/admin/camps/camp-02/camp-02-scr-3", label: "Open the screening" } },
      { text: "Enter a result as the doctor — no login needed.", go: { role: "doctor", href: "/doctor/camp/demo-rodriguez-ent", label: "Open the doctor link" } },
      { text: "Back as admin, click Send results to hfiles.in.", go: { role: "admin", href: "/admin/camps/camp-02/camp-02-scr-3", label: "Back to the screening" } },
    ],
    result: "The results table updates, and a sync confirmation appears.",
    goodToKnow: "Scheduling a brand-new camp works the same way, from Health camps.",
  },
  {
    id: 7,
    title: "Camp day on a phone",
    benefit: "Screen a whole class from a phone, one tap per student.",
    roles: ["nurse"],
    quick: false,
    why: "Camp day happens on the move, not at a desk.",
    steps: [
      { text: "Open the roster for a running camp.", go: { role: "nurse", href: "/nurse/camp/camp-02/roster", label: "Open the roster" } },
      { text: "Search for a student, or just tap Screen next." },
      { text: "Pick a quick finding, then Save & next." },
      { text: "Check the running summary." },
    ],
    result: "Progress updates live as each student is screened.",
    goodToKnow: "Built for one hand on a phone — try it at a narrow width.",
  },
  {
    id: 8,
    title: "Year-end promotion",
    benefit: "Move the whole school up a year in a few clicks.",
    roles: ["admin"],
    quick: false,
    why: "Every year, every class moves up — and old records shouldn't get lost.",
    steps: [
      { text: "Open Academic year, then Promote.", go: { role: "admin", href: "/admin/academic-year/promote", label: "Open Promote" } },
      { text: "Review the plan — who's promoted, who graduates." },
      { text: "Mark one student as an exception, e.g. retained." },
      { text: "Confirm." },
    ],
    result: "Students move up a grade, and last year's records are archived, not deleted.",
  },
  {
    id: 9,
    title: "Staff and access control",
    benefit: "Decide exactly what each role can see and do.",
    roles: ["admin", "teacher"],
    quick: false,
    why: "A teacher shouldn't see what a nurse sees, or edit medical records.",
    steps: [
      { text: "Open Staff, then a teacher's profile.", go: { role: "admin", href: "/admin/staff/stf-05", label: "Open a teacher's profile" } },
      { text: "Toggle one of their permissions off." },
      { text: "Switch to that teacher's own view.", go: { role: "teacher", href: "/teacher/class", label: "Switch to Teacher" } },
    ],
    result: "A visibly more limited view — exactly what you switched off.",
  },
  {
    id: 10,
    title: "Trust trail",
    benefit: "Every change is logged — who, what and when.",
    roles: ["admin"],
    quick: false,
    why: "Health records need a paper trail, even in a demo.",
    steps: [
      { text: "Edit something on a student's profile.", go: { role: "admin", href: `/admin/students/${HERO_STUDENT}`, label: "Open a profile" } },
      { text: "Open the Audit log.", go: { role: "admin", href: "/admin/audit-log", label: "Open Audit log" } },
      { text: "Open the Notifications log.", go: { role: "admin", href: "/admin/notifications-log", label: "Open Notifications log" } },
    ],
    result: "Both logs show exactly who changed or sent what, and when.",
  },
  {
    id: 11,
    title: "Make it yours",
    benefit: "Relabel the whole demo with a real school's name, instantly.",
    roles: ["admin"],
    quick: true,
    why: "A generic demo doesn't land the way a school's own name does.",
    steps: [
      { text: "Open Settings, then School profile, then Edit.", go: { role: "admin", href: "/admin/settings", label: "Open Settings" } },
      { text: "Type a real school's name and save." },
      { text: "Look at the sidebar and dashboard.", go: { role: "admin", href: "/admin/dashboard", label: "Open dashboard" } },
    ],
    result: "The whole app relabels itself, live — top bar, sidebar, everything.",
  },
];

export const QUICK_FLOW_COUNT = FLOWS.filter((f) => f.quick).length;
export const TOTAL_FLOW_COUNT = FLOWS.length;
