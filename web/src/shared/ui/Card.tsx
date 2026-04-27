import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  tone?: "default" | "warm";
}

const toneMap = {
  default: "bg-surface-container-lowest border border-ash-veil",
  warm: "bg-bone-cream-dim border border-ash-veil",
} as const;

export function Card({
  className,
  hoverable = false,
  tone = "default",
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl transition-all duration-300 ease-out-quart",
        toneMap[tone],
        hoverable && "hover:shadow-ambient-hover hover:-translate-y-px",
        className,
      )}
      {...rest}
    />
  );
}
