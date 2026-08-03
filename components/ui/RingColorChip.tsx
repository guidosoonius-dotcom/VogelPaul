import { getRingColorSwatch } from "@/lib/domain/ringColor";

export default function RingColorChip({ color }: { color: string | null | undefined }) {
  if (!color) return <>-</>;
  const swatch = getRingColorSwatch(color);
  return (
    <span className="inline-flex items-center gap-1.5">
      {swatch && (
        <span
          className="h-2.5 w-2.5 rounded-full border border-black/15"
          style={{ backgroundColor: swatch }}
        />
      )}
      {color}
    </span>
  );
}
