import { WORKS } from "../data";
import { useGo } from "../router";
import { Pill } from "../ui/kit";
import { Hero } from "../scenes/Hero";
import { Intro } from "../scenes/Intro";
import { Reel } from "../scenes/Reel";
import { Expertise } from "../scenes/Expertise";

// Home is curated, not exhaustive: who I am, four projects, what I offer,
// then contact. The full index, case studies and story live on their own
// pages.

/** A quiet way from the reel to the full index: one line and one button,
 *  so the expertise heading below stays the only loud thing in view. */
function AllWork() {
  const go = useGo();
  return (
    <section data-ink="#eef1f6" className="relative bg-night text-paper">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-6 border-b border-paper/12 px-5 py-14 md:flex-row md:items-center md:justify-between md:px-8 md:py-16">
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
      <Reel />
      <AllWork />
      <Expertise />
    </>
  );
}
