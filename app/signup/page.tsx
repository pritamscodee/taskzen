"use client";

import { Suspense } from "react";
import { SignupView } from "./signup-view";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupView />
    </Suspense>
  );
}