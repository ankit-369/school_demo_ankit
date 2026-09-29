"use client";

import { useState } from "react";
import { useGuideProgress } from "@/lib/guide/progress";
import { FlowSection } from "./_components/flow-section";
import { GuideDiagram } from "./_components/guide-diagram";
import { GuideFooter } from "./_components/guide-footer";
import { GuideHero } from "./_components/guide-hero";

export default function GuidePage() {
  const { checked, toggle } = useGuideProgress();
  const [showAll, setShowAll] = useState(false);

  return (
    <main>
      <GuideHero checkedCount={checked.length} />
      <GuideDiagram onNavigate={() => setShowAll(true)} />
      <FlowSection checked={checked} onToggleChecked={toggle} showAll={showAll} onShowAllChange={setShowAll} />
      <GuideFooter />
    </main>
  );
}
