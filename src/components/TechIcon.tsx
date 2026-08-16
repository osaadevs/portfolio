import { BRAND_ICONS, MONOGRAM_ICONS, TAG_ICON_MAP } from "./techIconData";

/** Renders a brand icon (or Adobe/Canva monogram) for a known tech tag label, else null. */
export function TechIcon({ label, className = "h-4 w-4" }: { label: string; className?: string }) {
  const entry = TAG_ICON_MAP[label];
  if (!entry) return null;

  if (entry.type === "brand") {
    const icon = BRAND_ICONS[entry.key];
    if (!icon) return null;
    return (
      <svg viewBox="0 0 24 24" className={className} fill={icon.hex} aria-hidden="true">
        <path d={icon.d} />
      </svg>
    );
  }

  const mono = MONOGRAM_ICONS[entry.key];
  if (!mono) return null;
  return (
    <span
      aria-hidden="true"
      style={{ background: mono.bg }}
      className={`flex items-center justify-center rounded-[4px] font-bold text-white ${className}`}
    >
      <span style={{ fontSize: "0.6em" }}>{mono.label}</span>
    </span>
  );
}
