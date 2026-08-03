import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "@/lib/utils/clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-moss text-card-raised hover:bg-moss-ink disabled:bg-moss/40",
  secondary:
    "bg-card-raised text-ink border border-line hover:border-moss disabled:text-ink-faint",
  danger: "bg-brick text-card-raised hover:brightness-90 disabled:bg-brick/40",
  ghost: "text-ink-soft border border-line hover:border-moss hover:text-ink disabled:text-ink-faint",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ variant = "primary", className, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold",
        "transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-0.5 hover:shadow-[0_4px_14px_-6px_rgba(46,32,21,0.35)] active:translate-y-0 active:scale-[0.97] active:shadow-none",
        "disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
});
