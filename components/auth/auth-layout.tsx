import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { TaskzenMark } from "@/components/landing/logo";

type AuthLayoutProps = {
  eyebrow: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

const panelNotes = [
  "Boards and lists that stay in sync in real time",
  "Drag a card, and every teammate sees it land",
  "A quiet, warm surface — not a wall of alerts",
];

export function AuthLayout({
  eyebrow,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <main className="flex min-h-svh bg-canvas">
      <section className="relative hidden w-[44%] shrink-0 overflow-hidden bg-surface-dark text-on-dark lg:block">
        <div className="flex h-full flex-col justify-between p-10">
          <div className="flex items-center justify-between">
            <Link href="/" aria-label="Back to Taskzen home">
              <TaskzenMark textClassName="text-on-dark" />
            </Link>
            <span className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-on-dark-soft">
              {eyebrow}
            </span>
          </div>

          <div className="max-w-sm">
            <h2 className="font-serif text-4xl font-medium leading-[1.08] tracking-tight text-on-dark">
              A quiet surface for the work that matters.
            </h2>
            <ul className="mt-8 space-y-3.5">
              {panelNotes.map((note) => (
                <li
                  key={note}
                  className="flex items-center gap-3 text-sm text-on-dark-soft"
                >
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-coral text-white">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-serif text-sm italic text-on-dark-soft">
                Live board
              </span>
              <span className="flex items-center gap-3 font-serif text-sm italic text-on-dark-soft">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-coral" />
                </span>
                synced
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="h-9 rounded-lg border border-white/10 bg-surface-dark-elevated/80" />
              <div className="h-9 rounded-lg border border-white/10 bg-surface-dark-elevated/80" />
              <div className="w-2/3 h-9 rounded-lg border border-coral/40 bg-coral/10" />
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-1 flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:hidden" aria-label="Back to Taskzen home">
            <TaskzenMark />
          </Link>
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-sm text-muted-soft transition-colors hover:text-ink lg:inline-flex"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        <div className="text-center text-sm text-muted-soft">{footer}</div>
      </section>
    </main>
  );
}