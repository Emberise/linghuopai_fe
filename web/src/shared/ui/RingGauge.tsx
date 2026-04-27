/**
 * RingGauge: 圆环进度环。
 * - 纯 CSS conic-gradient + mask
 * - 用 token 颜色（amber / slate）
 */
import { cn } from "@/shared/utils/cn";

interface RingGaugeProps {
  value: number; // 0..1
  label: string;
  display?: string;
  tone?: "amber" | "slate";
  size?: number;
  className?: string;
}

const toneColor: Record<NonNullable<RingGaugeProps["tone"]>, string> = {
  amber: "#EA5614",
  slate: "#4A616F",
};

export function RingGauge({
  value,
  label,
  display,
  tone = "amber",
  size = 96,
  className,
}: RingGaugeProps) {
  const clamped = Math.max(0, Math.min(1, value));
  const deg = clamped * 360;
  const color = toneColor[tone];
  const text = display ?? `${Math.round(clamped * 100)}%`;

  return (
    <div className={cn("inline-flex flex-col items-center gap-xs", className)}>
      <div
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(${color} ${deg}deg, oklch(92% 0.006 60) 0deg)`,
        }}
        aria-label={`${label} ${text}`}
        role="img"
      >
        <div
          className="absolute inset-[6px] rounded-full bg-surface-container-lowest flex items-center justify-center text-[14px] font-headline text-deep-char"
        >
          {text}
        </div>
      </div>
      <span className="text-[11px] text-graphite">{label}</span>
    </div>
  );
}
