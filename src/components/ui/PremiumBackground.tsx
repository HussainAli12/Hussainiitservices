"use client";

import dynamic from "next/dynamic";
import { useMotionBudget } from "@/components/providers/MotionBudgetProvider";
import { canUseHeavyEffects } from "@/lib/motion-budget";
import { useFirstInteraction } from "@/lib/use-first-interaction";

const ShapeGrid = dynamic(
  () => import("@/components/ui/ShapeGrid").then((mod) => mod.ShapeGrid),
  { ssr: false },
);

function StaticGridBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.45]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(29, 78, 216, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(29, 78, 216, 0.08) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    />
  );
}

function AnimatedGridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 opacity-[0.5]">
      <ShapeGrid
        direction="diagonal"
        speed={0.35}
        squareSize={56}
        shape="square"
        borderColor="rgba(29, 78, 216, 0.1)"
        hoverFillColor="rgba(29, 78, 216, 0.06)"
        hoverTrailAmount={8}
        targetFps={28}
      />
    </div>
  );
}

export function PremiumBackground() {
  const budget = useMotionBudget();
  // Static grid paints first; the animated canvas takes over after the first interaction.
  const interacted = useFirstInteraction();
  const heavy = canUseHeavyEffects(budget) && interacted;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-surface via-background to-background" />
      {heavy ? <AnimatedGridBackground /> : <StaticGridBackground />}
    </div>
  );
}
