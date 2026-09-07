"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { SylvaHero } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import { buttonVariants } from "@heroui/styles";
import { TaskzenMark } from "@/components/landing/logo";

const SHADER_FRAME_STYLE_ID = "taskzen-shader-frame-fix";
const SHADER_HIDE_STYLE_ID = "taskzen-shader-hide-stock";

const HIDDEN_STOCK_SELECTORS = [
  ".card--about",
  ".knob-float",
  ".knob--about",
  "h1.headline",
  "p.lede",
  ".pill-clip",
  ".play-wrap",
  "dl.stat--a",
  "dl.stat--b",
  ".card--stove",
  "a.scroll",
  ".ghost",
];

function useShaderFrameStabilizer() {
  const frameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = frameRef.current;
    if (!root || typeof MutationObserver === "undefined") return;

    let current: HTMLIFrameElement | null = null;

    const upsertStyle = (
      doc: Document,
      id: string,
      css: string,
    ): void => {
      const existing = doc.getElementById(id);
      if (existing) {
        if (existing.textContent !== css) existing.textContent = css;
        return;
      }
      const style = doc.createElement("style");
      style.id = id;
      style.textContent = css;
      doc.head.appendChild(style);
    };

    const inject = (iframe: HTMLIFrameElement) => {
      try {
        const doc = iframe.contentDocument;
        if (!doc) return;
        upsertStyle(
          doc,
          SHADER_FRAME_STYLE_ID,
          [
            "html,body{overflow:hidden !important;overscroll-behavior:none !important}",
            "html *{scrollbar-width:none !important;-ms-overflow-style:none !important}",
            "html *::-webkit-scrollbar{display:none !important;width:0 !important;height:0 !important}",
            "html::-webkit-scrollbar,body::-webkit-scrollbar{display:none !important;width:0 !important;height:0 !important}",
          ].join(""),
        );
        upsertStyle(
          doc,
          SHADER_HIDE_STYLE_ID,
          `${HIDDEN_STOCK_SELECTORS.join(",")}{display:none !important;visibility:hidden !important;opacity:0 !important;pointer-events:none !important}`,
        );
      } catch {
        /* keep the authored page pristine if the frame is not same-origin */
      }
    };

    const observer = new MutationObserver(() => {
      const iframe = root.querySelector("iframe");
      if (iframe !== current) {
        current = iframe;
        if (iframe) {
          inject(iframe);
          iframe.addEventListener("load", () => inject(iframe));
        }
      }
    });

    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return frameRef;
}

export function SylvaHeroBand() {
  const frameRef = useShaderFrameStabilizer();

  return (
    <section className="relative h-svh min-h-[560px] w-full overflow-hidden bg-surface-dark">
      <div className="shader-frame absolute inset-0" ref={frameRef}>
        <SylvaHero
          headingFont="lexend"
          bodyFont="lexend"
          headingWeight="300"
          bodyWeight="300"
          primaryColor="#ffffff"
          headingSize={63}
          bodySize={16.5}
          headingLetterSpacing={-0.006}
          {...({ variant: "living-green" } as Parameters<typeof SylvaHero>[0])}
        />
      </div>

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