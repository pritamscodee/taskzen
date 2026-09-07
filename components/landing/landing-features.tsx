import {
  KanbanSquare,
  Radio,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: Radio,
    title: "Live as it happens",
    description:
      "Boards, tasks, and statuses sync the moment anything changes — no refresh, no stale tabs.",
  },
  {
    icon: KanbanSquare,
    title: "Calm kanban boards",
    description:
      "Plan, assign, and move work across columns with a drag-and-drop flow that feels effortless.",
  },
  {
    icon: Users,
    title: "Invite your team",
    description:
      "Share a workspace link and bring people in by email — roles and ownership stay clean.",
  },
  {
    icon: Zap,
    title: "Instant updates",
    description:
      "A dedicated real-time channel keeps every member in step, even when plans change mid-flight.",
  },
  {
    icon: ShieldCheck,
    title: "Roles you control",
    description:
      "Invite, assign, and manage access from one surface. Everyone sees the same board.",
  },
  {
    icon: Sparkles,
    title: "Built for focus",
    description:
      "A warm, quiet canvas with the product chrome upfront — work, not widgets.",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="border-y border-hairline bg-canvas">
      <div className="mx-auto max-w-[1200px] px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-coral">
            Why Taskzen
          </p>
          <h2 className="mt-4 font-serif text-4xl font-normal leading-[1.1] tracking-[-1px] text-ink sm:text-5xl">
            A shared space your team actually enjoys
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-body">
            Everything the moment it happens — the calm of a well-run board,
            without the swivel-chairing.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl bg-surface-card p-8 transition-colors hover:bg-surface-cream"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-coral/10 text-coral">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <h3 className="mt-6 text-lg font-medium text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-body">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}