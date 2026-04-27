import { cn } from "@/shared/utils/cn";

interface BadgeProps {
  tone?: "amber" | "slate" | "graphite" | "info" | "success" | "danger";
  children: React.ReactNode;
  className?: string;
}

const toneMap: Record<NonNullable<BadgeProps["tone"]>, string> = {
  amber: "bg-linghuo-amber/10 text-linghuo-amber",
  slate: "bg-secondary/10 text-misty-slate",
  graphite: "bg-warm-ash/20 text-graphite",
  info: "bg-secondary-container text-on-secondary-container",
  success: "bg-emerald-50 text-emerald-700",
  danger: "bg-error-container text-on-error-container",
};

export function Badge({ tone = "graphite", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-xs rounded px-2 py-0.5 font-label text-[11px] leading-none tracking-wide",
        toneMap[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
