export default function FeatherMark({
  className = "h-[22px] w-[22px]",
  veinColor = "var(--moss)",
}: {
  className?: string;
  veinColor?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2C8 4 5 9 5 14c0 4 2.5 7 7 8 4.5-1 7-4 7-8 0-5-3-10-7-12Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path d="M12 4v17" stroke={veinColor} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
