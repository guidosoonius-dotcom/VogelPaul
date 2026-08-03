import { clsx } from "@/lib/utils/clsx";

export default function StatTile({
  label,
  value,
  accent = "moss",
  flat = false,
  trend,
}: {
  label: string;
  value: string | number;
  accent?: "moss" | "brass";
  flat?: boolean;
  trend?: string;
}) {
  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-md p-4",
        "transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
        flat
          ? "bg-ground-deep"
          : "border border-line-soft bg-card hover:-translate-y-1 hover:border-line hover:shadow-[0_10px_24px_-14px_rgba(46,32,21,0.4)]",
      )}
    >
      {!flat && (
        <span
          className={clsx(
            "absolute inset-y-0 left-0 w-[3px]",
            accent === "brass" ? "bg-brass" : "bg-moss",
          )}
        />
      )}
      {trend && (
        <span className="absolute right-3 top-3 rounded-full bg-moss-tint px-2 py-0.5 font-mono text-[11px] font-bold text-moss-ink">
          {trend}
        </span>
      )}
      <div className={clsx("font-mono font-bold tabular-nums leading-none", flat ? "text-xl" : "text-3xl")}>
        {value}
      </div>
      <div className="mt-2 text-xs text-ink-soft">{label}</div>
    </div>
  );
}
