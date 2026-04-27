/**
 * Material Symbols Outlined 图标。stitch 设计稿大量使用 Google Material Symbols，
 * 这里只做轻封装，保证 className/size 协调。
 */
import { cn } from "@/shared/utils/cn";

interface IconProps {
  name: string;
  className?: string;
  filled?: boolean;
  weight?: 300 | 400 | 500 | 600 | 700;
  size?: number;
  ariaLabel?: string;
}

export function Icon({
  name,
  className,
  filled = false,
  weight = 400,
  size,
  ariaLabel,
}: IconProps) {
  return (
    <span
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn("material-symbols-outlined leading-none", className)}
      style={{
        fontSize: size ? `${size}px` : undefined,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
      }}
    >
      {name}
    </span>
  );
}
