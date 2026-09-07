import type { Metadata } from "next";
import { SylvaHeroBand } from "@/components/landing/sylva-hero-band";

export const metadata: Metadata = {
  title: "Taskzen — Work, in real time",
  description:
    "Taskzen gives teams a shared, calm space to plan, assign, and move work forward in real time.",
};

export default function LandingPage() {
  return (
    <main className="min-h-svh bg-surface-dark">
      <SylvaHeroBand />
    </main>
  );
}