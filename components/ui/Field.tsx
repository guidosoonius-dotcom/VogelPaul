import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { clsx } from "@/lib/utils/clsx";

const inputClasses =
  "block w-full rounded-2xl border-2 border-line bg-card-raised px-4 py-2.5 text-sm text-ink shadow-sm placeholder:text-ink-faint transition-colors duration-150 focus:border-brass focus:outline-none disabled:bg-ground-deep";

export function FieldWrapper({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-bold text-ink">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink-faint">{hint}</p>}
      {error && <p className="text-xs text-brick">{error}</p>}
    </div>
  );
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(inputClasses, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx(inputClasses, className)} {...props} />;
}

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={clsx(
        inputClasses,
        "appearance-none bg-[linear-gradient(45deg,transparent_50%,var(--ink-soft)_50%),linear-gradient(135deg,var(--ink-soft)_50%,transparent_50%)] bg-[position:calc(100%-16px)_center,calc(100%-11px)_center] bg-[size:5px_5px,5px_5px] bg-no-repeat pr-8",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
