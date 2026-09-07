import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata: Metadata = {
  title: "Taskzen — Work, in real time",
  description:
    "Taskzen gives teams a shared, calm space to plan, assign, and move work forward in real time.",
};

export default function Page() {
  return <LandingPage />;
}