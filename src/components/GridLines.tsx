// Persistent grid frame. Two vertical guide lines sit at the edges of the
// centred content column and run the FULL viewport height at every scroll
// position (position: fixed). They stay aligned with the content because this
// frame shares the same max-width (1400) and responsive insets as Container.
//
// Horizontal grid rules are the section dividers themselves (Section's
// full-bleed border-b), so vertical + horizontal always read as one grid.
export function GridLines() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <div className="relative mx-auto h-full max-w-[1400px]">
        <div className="absolute inset-y-0 left-4 w-px bg-border sm:left-10 lg:left-20" />
        <div className="absolute inset-y-0 right-4 w-px bg-border sm:right-10 lg:right-20" />
      </div>
    </div>
  );
}
