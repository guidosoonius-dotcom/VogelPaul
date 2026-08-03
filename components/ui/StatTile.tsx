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
        "relative overflow-hidden rounded-2xl p-4",
        flat ? "bg-ground-deep" : "border-2 border-line-soft bg-card",
      )}
    >
      {!flat && (
        <span
          className={clsx(
            "absolute inset-y-0 left-0 w-1 rounded-l-2xl",
            accent === "brass" ? "bg-brass" : "bg-moss",
          )}
        />
      )}
      {trend && (
        <span className="absolute right-3 top-3 rounded-full bg-moss-tint px-2 py-0.5 font-mono text-[11px] font-bold text-moss-ink">
          {trend}
        </span>
      )}
      <div
        className={clsx(
          "font-display font-black tabular-nums leading-none",
          flat ? "text-xl" : "text-3xl",
        )}
      >
        {value}
      </div>
      <div className="mt-2 text-xs text-ink-soft">{label}</div>
    </div>
  );
}
