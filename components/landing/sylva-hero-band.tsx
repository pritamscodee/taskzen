"use client";

import Link from "next/link";
import { buttonVariants } from "@heroui/styles";
import { TaskzenMark } from "@/components/landing/logo";

export function SylvaHeroBand() {
  return (
    <section className="relative h-svh min-h-[560px] w-full overflow-hidden bg-surface-dark">
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.32em] text-white/55">
          Taskzen
        </p>
        <h1
          className="mt-4 max-w-5xl font-serif text-6xl font-medium leading-[1.02] text-white sm:text-7xl md:text-8xl"
          style={{ textShadow: "0 2px 48px rgba(0,0,0,0.4)" }}
        >
          Work, <span className="italic text-coral-primary">in real time.</span>
        </h1>
        <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-white/75 sm:text-lg">
          One calm space for your team to plan, assign, and move work forward —
          boards that update the moment anything changes.
        </p>
        <div className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/signup"
            className={buttonVariants({
              variant: "primary",
              size: "lg",
              className:
                "rounded-full !bg-white !text-surface-dark shadow-sm hover:!bg-white/90",
            })}
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white/90 backdrop-blur-md transition-colors hover:bg-white/20"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden items-center justify-center gap-4 sm:flex">
        <span className="rounded-full bg-black/25 px-5 py-2.5 backdrop-blur-md">
          <span className="font-serif text-lg text-white">Workspaces</span>
          <span className="ml-2 font-sans text-xs text-white/65">
            yours + shared
          </span>
        </span>
        <span className="rounded-full bg-black/25 px-5 py-2.5 backdrop-blur-md">
          <span className="font-serif text-lg text-white">Members</span>
          <span className="ml-2 font-sans text-xs text-white/65">
            invite &amp; roles
          </span>
        </span>
        <span className="rounded-full bg-black/25 px-5 py-2.5 backdrop-blur-md">
          <span className="font-serif text-lg text-white">Live</span>
          <span className="ml-2 font-sans text-xs text-white/65">
            updates as they happen
          </span>
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-start justify-between p-5 sm:p-7">
        <Link
          href="/"
          aria-label="Taskzen home"
          className="pointer-events-auto rounded-full bg-black/20 px-4 py-2.5 backdrop-blur-md transition-colors hover:bg-black/30"
        >
          <TaskzenMark textClassName="text-white" />
        </Link>

        <nav className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-black/20 p-1.5 backdrop-blur-md">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={buttonVariants({
              variant: "primary",
              size: "sm",
              className:
                "rounded-full !bg-white !text-surface-dark shadow-sm hover:!bg-white/90",
            })}
          >
            Get started
          </Link>
        </nav>
      </div>
    </section>
  );
}