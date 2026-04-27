import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/shared/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const sizeMap: Record<Size, string> = {
  sm: "h-9 px-md text-[13px]",
  md: "h-11 px-lg text-body",
  lg: "h-12 px-lg text-title",
};

const variantMap: Record<Variant, string> = {
  primary:
    "bg-linghuo-amber text-white shadow-ambient-rest hover:brightness-110 active:scale-[0.98]",
  secondary:
    "bg-bone-cream-dim text-deep-char border border-ash-veil hover:bg-surface-container-low active:scale-[0.98]",
  ghost:
    "bg-transparent text-graphite hover:text-deep-char hover:bg-bone-cream-dim",
  danger:
    "bg-error text-on-error hover:brightness-110 active:scale-[0.98]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", fullWidth, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-sm rounded-lg font-medium transition-all duration-200 ease-out-quart",
        "disabled:cursor-not-allowed disabled:opacity-60",
        sizeMap[size],
        variantMap[variant],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    />
  );
});
