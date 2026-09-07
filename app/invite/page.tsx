"use client";

import { Suspense } from "react";
import { InviteView } from "./invite-view";

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <main className="app-dark flex min-h-svh items-center justify-center bg-surface-dark px-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-on-dark-soft shadow-2xl shadow-black/30">
            <p className="text-sm">Loading invite…</p>
          </div>
        </main>
      }
    >
      <InviteView />
    </Suspense>
  );
}