import Link from "next/link";
import { buttonVariants } from "@heroui/styles";
import { TaskzenMark } from "@/components/landing/logo";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link href="/" aria-label="Taskzen home">
          <TaskzenMark textClassName="text-ink" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {[
            { href: "#features", label: "Features" },
            { href: "#live", label: "Live updates" },
            { href: "#get-started", label: "Get started" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-body transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-body transition-colors hover:bg-surface-soft hover:text-ink sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={buttonVariants({
              variant: "primary",
              size: "sm",
              className: "!bg-coral text-white hover:!bg-coral-active",
            })}
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}