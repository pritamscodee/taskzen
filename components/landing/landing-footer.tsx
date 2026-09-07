import { TaskzenMark } from "@/components/landing/logo";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Workspaces", href: "/workspaces" },
      { label: "Live boards", href: "/" },
      { label: "Invite members", href: "/invite" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/signup" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="bg-surface-dark text-on-dark-soft">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <TaskzenMark textClassName="text-on-dark" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              A shared, calm space to plan, assign, and move work forward in
              real time.
            </p>
          </div>
          {FOOTER_LINKS.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-on-dark-soft">
                {group.heading}
              </h3>
              <ul className="mt-4 grid gap-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-on-dark-soft transition-colors hover:text-on-dark"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-on-dark-soft">
            © {new Date().getFullYear()} Taskzen
          </p>
          <p className="text-xs text-on-dark-soft">
            Crafted for focused teams.
          </p>
        </div>
      </div>
    </footer>
  );
}