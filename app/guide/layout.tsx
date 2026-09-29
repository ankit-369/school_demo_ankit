import type { Metadata } from "next";

const TITLE = "HealthConnect: school health, in one place";
const DESCRIPTION = "See the whole product in 3 minutes — click through as Admin, Nurse, Teacher or a visiting doctor.";

export const metadata: Metadata = {
  title: "Demo guide",
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

/** No sidebar, no top bar, no role required — this is the one link anyone can open cold. */
export default function GuideLayout({ children }: LayoutProps<"/guide">) {
  return <div className="min-h-dvh bg-canvas">{children}</div>;
}
