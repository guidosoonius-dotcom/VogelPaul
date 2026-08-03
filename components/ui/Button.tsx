import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "@/lib/utils/clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink text-card-raised hover:bg-ink/85 disabled:bg-ink/40",
  secondary:
    "bg-card-raised text-ink border-2 border-line hover:border-brass disabled:text-ink-faint",
  danger: "bg-brick text-card-raised hover:brightness-90 disabled:bg-brick/40",
  ghost: "text-ink-soft border-2 border-line hover:border-brass hover:text-ink disabled:text-ink-faint",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }
>(function Button({ variant = "primary", className, ...props }, ref) {
  return (
    <button
      ref={ref}
      className={clsx(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold",
        "transition-[transform,box-shadow,background-color,border-color,color] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-0.5 hover:shadow-[0_4px_14px_-6px_rgba(24,20,15,0.35)] active:translate-y-0 active:scale-[0.97] active:shadow-none",
        "disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
});
