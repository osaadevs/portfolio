import { useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import { WORKS, workBySlug } from "../data";
import { REDUCED, gsap, useGSAP } from "../lib";
import { TLink } from "../router";
import { Pill } from "../ui/kit";

// A case study. The header takes the project's own colour, then the cover
// runs full width, then the overview and a set of detail crops, and the
// page ends on the next project as a sheet you can step straight into.
// Projects without a write-up say so plainly instead of padding it out.

export default function CaseStudy() {
  const { slug } = useParams();
  const w = workBySlug(slug);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (REDUCED || !w) return;
      const q = gsap.utils.selector(root);
      gsap.from(q("[data-rise]"), { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.06, delay: 0.25 });
      gsap.from(q("[data-fade]"), { opacity: 0, y: 20, duration: 0.9, ease: "power3.out", stagger: 0.06, delay: 0.5 });
      gsap.fromTo(
        q("[data-cover] img"),
        { scale: 1.15, yPercent: -4 },
        { scale: 1, yPercent: 4, ease: "none", scrollTrigger: { trigger: q("[data-cover]")[0], start: "top bottom", end: "bottom top", scrub: true } },
      );
      q("[data-detail]").forEach((el: Element, i: number) =>
        gsap.from(el, { y: 60 + i * 30, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } }),
      );
    },
    { scope: root, dependencies: [slug] },
  );

  if (!w) return <Navigate to="/work" replace />;
  const index = WORKS.indexOf(w);
  const next = WORKS[(index + 1) % WORKS.length];
  const p = w.project;
  const tools = p && !p.tagsUnconfirmed ? p.tags : [];

  const meta = [
    { label: "Type", value: w.kind },
    { label: "Role", value: w.role },
    ...(w.note ? [{ label: "Recognition", value: w.note }] : []),
    ...(tools.length ? [{ label: "Tools", value: tools.join(", ") }] : []),
  ];

  return (
    <div ref={root} key={slug}>
      <header data-ink={w.ink} className="relative z-10" style={{ background: w.bg, color: w.ink }}>
        <div className="frame pb-14 pt-28 md:pb-20 md:pt-36">
          <div data-fade className="flex items-center justify-between text-sm">
            <TLink to="/work" className="font-semibold opacity-80 hover:opacity-100" data-cursor="Back">
              ← All work
            </TLink>
            <span className="opacity-60">
              Project {String(index + 1).padStart(2, "0")} of {String(WORKS.length).padStart(2, "0")}
            </span>
          </div>
          <h1 className="display mt-10 text-[clamp(3rem,10vw,10.5rem)] md:mt-14">
            <span className="line-mask">
              <span data-rise className="block">
                {w.name}
              </span>
            </span>
          </h1>
          <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12">
            <p data-fade className="text-xl leading-relaxed md:col-span-6 md:text-2xl">
              {w.line}
            </p>
            <dl data-fade className="grid grid-cols-2 gap-x-6 gap-y-5 text-[15px] md:col-span-5 md:col-start-8">
              {meta.map((m) => (
                <div key={m.label} className="border-t border-current/20 pt-3">
                  <dt className="text-sm opacity-60">{m.label}</dt>
                  <dd className="mt-1 font-semibold">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <div style={{ background: `linear-gradient(to bottom, ${w.bg} 50%, #eef1f6 50%)` }}>
        <div className="frame">
          <div data-cover className="aspect-[16/9] overflow-hidden rounded-[24px] md:rounded-[40px]">
            <img src={w.img} alt={`${w.name} cover`} className="size-full object-cover" />
          </div>
        </div>
      </div>

      <section data-ink="#070b14" className="bg-paper text-night">
        <div className="frame py-20 md:py-28">
          <div className="grid gap-8 md:grid-cols-12">
            <h2 className="display text-[clamp(1.8rem,3.4vw,3rem)] md:col-span-4">Overview</h2>
            <div className="md:col-span-7 md:col-start-6">
              {p ? (
                <p className="text-lg leading-relaxed text-night/80 md:text-xl">{p.description}</p>
              ) : (
                <>
                  <p className="text-lg leading-relaxed text-night/80 md:text-xl">{w.line}</p>
                  <p className="mt-6 text-[15px] text-night/55">The full write-up for this project is in progress.</p>
                </>
              )}
              {p?.liveLink && (
                <div className="mt-8">
                  <Pill href={p.liveLink.href} tone="night" external cursor="Visit">
                    {p.liveLink.label}
                  </Pill>
                </div>
              )}
            </div>
          </div>

          <div className="mt-20 grid gap-8 md:mt-28 md:grid-cols-12">
            <h2 className="display text-[clamp(1.8rem,3.4vw,3rem)] md:col-span-4">Details</h2>
            <div className="grid grid-cols-2 gap-3 md:col-span-8 md:gap-5">
              {w.focus.map((f, i) => (
                <div
                  key={f + i}
                  data-detail
                  className={`overflow-hidden rounded-[20px] md:rounded-[28px] ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/5]"}`}
                  style={{ background: w.bg }}
                >
                  <img src={w.img} alt="" className="size-full object-cover" style={{ objectPosition: f, scale: i === 0 ? "1.6" : "2.4" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Next project: the page ends on a sheet in the next project's colour. */}
      <div style={{ background: "linear-gradient(to bottom, #eef1f6 50%, transparent 50%)" }}>
        <TLink
          to={`/work/${next.slug}`}
          data-cursor="Next"
          data-ink={next.ink}
          className="group block overflow-hidden rounded-b-[40px] rounded-t-[40px] md:rounded-b-[64px] md:rounded-t-[64px]"
          style={{ background: next.bg, color: next.ink }}
        >
          <div className="frame grid items-center gap-8 py-16 md:grid-cols-12 md:py-24">
            <div className="md:col-span-7">
              <p className="text-sm opacity-70">Next project</p>
              <p className="display mt-4 text-[clamp(2.6rem,8vw,8rem)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-3">
                {next.name}
              </p>
              <p className="mt-4 text-sm opacity-70">{next.kind}</p>
            </div>
            <div className="aspect-[16/10] overflow-hidden rounded-[20px] md:col-span-5 md:rounded-[28px]">
              <img src={next.img} alt="" className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]" />
            </div>
          </div>
        </TLink>
      </div>
    </div>
  );
}
