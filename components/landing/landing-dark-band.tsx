import Link from "next/link";
import { buttonVariants } from "@heroui/styles";
import { Activity } from "lucide-react";

const ACTIVITY = [
  {
    initials: "DR",
    color: "bg-coral",
    text: "Moved “Port the kanban view” to In progress",
    time: "just now",
  },
  {
    initials: "MK",
    color: "bg-teal",
    text: "Assigned “Invite design team” to Aisha",
    time: "12s ago",
  },
  {
    initials: "AJ",
    color: "bg-amber",
    text: "Completed “Wire up live sync”",
    time: "48s ago",
  },
];

export function LandingDarkBand() {
  return (
    <section id="live" className="bg-surface-dark text-on-dark">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-6 py-24 md:grid-cols-2 md:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-coral">
            Live updates
          </p>
          <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.1] tracking-[-1px] text-on-dark sm:text-5xl">
            Same board, same moment.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-on-dark-soft">
            When someone moves a card across the room, you see it instantly. No
            refresh, no “did you get my change?” — just one truth.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/workspaces"
              className={buttonVariants({
                variant: "primary",
                size: "lg",
                className:
                  "!bg-coral text-white hover:!bg-coral-active transition-colors",
              })}
            >
              Open your workspaces
            </Link>
            <Link
              href="/signup"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "!bg-surface-dark-elevated text-on-dark",
              })}
            >
              Create a board
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-dark-elevated p-6">
          <div className="flex items-center justify-between pb-4">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-on-dark">
              <Activity className="size-4 text-coral" />
              Recent activity
            </span>
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-medium text-on-dark-soft">
              synced
            </span>
          </div>
          <div className="grid gap-3">
            {ACTIVITY.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3.5 rounded-xl bg-surface-dark px-4 py-3.5"
              >
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold text-on-dark ${item.color}`}
                >
                  {item.initials}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm text-on-dark">{item.text}</p>
                  <p className="mt-0.5 text-xs text-on-dark-soft">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}