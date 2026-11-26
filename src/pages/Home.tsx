import { FEATURED, WORKS } from "../data";
import { useGo } from "../router";
import { Pill } from "../ui/kit";
import { Hero } from "../scenes/Hero";
import { Intro } from "../scenes/Intro";
import { Reel } from "../scenes/Reel";
import { Expertise } from "../scenes/Expertise";

// Home is curated, not exhaustive: who I am, four projects, what I offer,
// then contact. The full index, case studies and story live on their own
// pages.

/** Announces the reel, so the first full-screen project never arrives
 *  unannounced: the section title, how many, and how to move through it. */
function WorkLead() {
  return (
    <section data-ink="#070b14" className="relative bg-paper text-night">
      <div className="frame flex flex-col gap-6 pb-12 pt-6 md:flex-row md:items-end md:justify-between md:pb-16 md:pt-10">
        <h2 className="display text-[clamp(2.6rem,7vw,7rem)]">Selected work</h2>
        <p className="flex items-center gap-4 text-[15px] text-night/60 md:pb-4">
          <span>
            {String(FEATURED.length).padStart(2, "0")} projects. Scroll to move through them.
          </span>
          <span className="grid size-11 shrink-0 place-items-center rounded-full ring-1 ring-night/20" aria-hidden="true">
            <svg viewBox="0 0 24 24" className="size-[18px] animate-[nudge_1.8s_ease-in-out_infinite] motion-reduce:animate-none" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </span>
        </p>
      </div>
    </section>
  );
}

/** A quiet way from the reel to the full index: one line and one button,
 *  so the expertise heading below stays the only loud thing in view. */
function AllWork() {
  const go = useGo();
  return (
    <section data-ink="#eef1f6" className="relative bg-night text-paper">
      <div className="frame flex flex-col gap-6 border-b border-paper/12 py-14 md:flex-row md:items-center md:justify-between md:py-16">
        <p className="max-w-[46ch] text-lg leading-relaxed text-paper/70">
          These are four of {WORKS.length} projects. The full index covers UI/UX, branding, web and photography.
        </p>
        <Pill onClick={() => go("/work")} cursor="All work">
          View all work
        </Pill>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <WorkLead />
      <Reel />
      <AllWork />
      <Expertise />
    </>
  );
}
