import Link from "next/link";
import { buttonVariants } from "@heroui/styles";
import { ArrowRight } from "lucide-react";

const KANBAN = [
  {
    label: "To do",
    dot: "bg-muted-soft",
    cards: [
      { title: "Draft launch checklist", tag: "Marketing", accent: "bg-accent-amber" },
      { title: "Q3 roadmap review", tag: "Planning", accent: "bg-coral" },
    ],
  },
  {
    label: "In progress",
    dot: "bg-coral",
    cards: [
      { title: "Port the kanban view", tag: "Engineering", accent: "bg-accent-teal" },
      { title: "Invite design team", tag: "Members", accent: "bg-coral" },
    ],
  },
  {
    label: "Done",
    dot: "bg-accent-teal",
    cards: [
      { title: "Wire up live sync", tag: "Engineering", accent: "bg-accent-teal" },
    ],
  },
];

export function LandingHero() {
  return (
    <section className="bg-canvas text-ink">
      <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-6 py-24 md:grid-cols-2 md:py-28">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-coral">
            Taskzen
          </p>
          <h1 className="mt-5 font-serif text-5xl font-normal leading-[1.05] tracking-[-1.5px] text-ink sm:text-6xl md:text-[64px]">
            Work, <span className="italic text-coral">in real time.</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-body">
            One calm space for your team to plan, assign, and move work
            forward — boards that update the moment anything changes.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/signup"
              className={buttonVariants({
                variant: "primary",
                size: "lg",
                className:
                  "!bg-coral text-white hover:!bg-coral-active transition-colors",
              })}
            >
              Get started free
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "text-ink",
              })}
            >
              Sign in
            </Link>
          </div>
          <p className="mt-5 text-sm text-muted-soft">
            Free for small teams. No credit card required.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 -z-10 rounded-[32px] bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--coral)_14%,transparent),transparent)]" />
          <div className="rounded-2xl border border-hairline bg-surface-card p-4 shadow-[0_24px_48px_-24px_hsl(0_0%_0%/0.25)]">
            <div className="flex items-center justify-between px-1 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-coral/80" />
                <span className="size-2.5 rounded-full bg-accent-amber/80" />
                <span className="size-2.5 rounded-full bg-accent-teal/80" />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-canvas px-2.5 py-1 text-[11px] font-medium text-body">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-teal opacity-60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-accent-teal" />
                </span>
                Live
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {KANBAN.map((column) => (
                <div
                  key={column.label}
                  className="grid content-start gap-2 rounded-xl bg-surface-soft p-2.5"
                >
                  <div className="flex items-center justify-between px-0.5 pb-1">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-body">
                      <span className={`size-1.5 rounded-full ${column.dot}`} />
                      {column.label}
                    </span>
                    <span className="text-[10px] text-muted-soft">
                      {column.cards.length}
                    </span>
                  </div>
                  {column.cards.map((card) => (
                    <div
                      key={card.title}
                      className="rounded-lg border border-hairline bg-canvas px-2.5 py-2"
                    >
                      <p className="text-xs font-medium leading-snug text-ink">
                        {card.title}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-soft">
                          <span
                            className={`size-1.5 rounded-full ${card.accent}`}
                          />
                          {card.tag}
                        </span>
                        <span className="grid size-4 place-items-center rounded-full bg-surface-dark text-[9px] font-semibold text-on-dark">
                          {card.tag[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}