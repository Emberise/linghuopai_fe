import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useId,
} from "react";
import { cn } from "@/shared/utils/cn";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  leadingIcon?: ReactNode;
  trailing?: ReactNode;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { label, hint, leadingIcon, trailing, className, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="space-y-xs">
      {label ? (
        <label
          htmlFor={inputId}
          className="block font-label text-label text-graphite ml-xs"
        >
          {label}
        </label>
      ) : null}
      <div className="relative flex items-center gap-sm">
        <div className="relative flex-grow flex items-center">
          {leadingIcon ? (
            <span className="absolute left-md text-warm-ash">{leadingIcon}</span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-lg border border-ash-veil bg-bone-cream py-md pr-md font-body text-body text-deep-char outline-none transition-all",
              "placeholder:text-warm-ash",
              "focus:border-linghuo-amber focus:ring-1 focus:ring-linghuo-amber",
              leadingIcon ? "pl-xl" : "pl-md",
              className,
            )}
            {...rest}
          />
        </div>
        {trailing}
      </div>
      {hint ? <p className="text-[11px] text-warm-ash ml-xs">{hint}</p> : null}
    </div>
  );
});
