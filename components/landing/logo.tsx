import { Check } from "lucide-react";

type LogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
};

export function TaskzenMark({
  className,
  markClassName,
  textClassName,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <span
        className={`grid size-7 shrink-0 place-items-center rounded-[9px] bg-coral text-white shadow-[0_1px_2px_hsl(0_0%_0%/0.18)] ${markClassName ?? ""}`}
      >
        <Check className="size-4" strokeWidth={3} />
      </span>
      <span
        className={`font-serif text-[1.35rem] font-semibold leading-none tracking-tight ${textClassName ?? ""}`}
      >
        Taskzen
      </span>
    </span>
  );
}