import Link from "next/link";
import { buttonVariants } from "@heroui/styles";
import { ArrowRight } from "lucide-react";

export function LandingCta() {
  return (
    <section id="get-started" className="bg-canvas px-6 py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="rounded-2xl bg-coral px-8 py-16 text-center sm:px-16 sm:py-20">
          <h2 className="mx-auto max-w-2xl font-serif text-4xl font-normal leading-[1.1] tracking-[-0.5px] text-white sm:text-5xl">
            Start moving work in real time.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            Free for small teams. Your workspace is a shared link away.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "!bg-white !text-ink hover:!bg-white/90",
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
                className: "border-white/40 !text-white hover:!bg-white/10",
              })}
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}