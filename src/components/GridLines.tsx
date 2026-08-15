// Two vertical guide lines that run the full height of the page, unbroken
// by section boundaries — mirrors the fix made in the Figma source (the
// lines used to exist only inside the hero section).
export function GridLines() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 mx-auto hidden w-full max-w-[1440px] sm:block">
      <div className="absolute inset-y-0 left-4 w-px bg-border sm:left-10 lg:left-20" />
      <div className="absolute inset-y-0 right-4 w-px bg-border sm:right-10 lg:right-20" />
    </div>
  );
}
