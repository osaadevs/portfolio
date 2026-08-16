import { motion } from "framer-motion";
import { hero } from "../content";
import { Button, Container, EASE, StatusBadge, fadeUp, staggerContainer } from "./ui";
import { HeroGraphic } from "./HeroGraphic";

function SplitLine({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <span key={i}>{part}</span> : <span key={i} className="text-text-muted">{part}</span>,
      )}
    </>
  );
}

// Ambient layer (motion-design "third layer"): a slow, low-opacity azure
// aurora that drifts behind the hero. Purely decorative, hidden for
// reduced-motion via MotionConfig stripping the animate transform.
function HeroAura() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 0.5,
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ opacity: { duration: 1.2 }, x: { duration: 22, repeat: Infinity, ease: "easeInOut" }, y: { duration: 26, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute -right-24 top-1/4 h-[520px] w-[520px] rounded-full bg-accent/20 blur-[140px]"
      />
    </div>
  );
}

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh flex-col justify-center border-b border-border py-28 md:py-32"
    >
      <HeroAura />
      <Container>
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_1fr]"
        >
          <div>
            <StatusBadge>{hero.badge}</StatusBadge>

            <motion.h1
              variants={fadeUp}
              className="mt-6 max-w-3xl text-[44px] font-extrabold leading-[1.03] tracking-[-1.5px] text-text-primary sm:text-6xl md:text-[68px] md:leading-[1.02] md:tracking-[-2.5px]"
            >
              {hero.headlineLines.map((line, i) => (
                <span key={i} className="block">
                  <SplitLine text={line} />
                </span>
              ))}
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-7 max-w-[460px] text-lg leading-[1.7] text-text-secondary">
              {hero.subline}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
              <Button href={hero.primaryCta.href} size="lg" glow>
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="ghost" size="lg" icon="download" download>
                {hero.secondaryCta.label}
              </Button>
            </motion.div>
          </div>

          {/* Fills the space that used to hold a headshot placeholder — a
              circuit/constellation graphic that extends the site's own
              grid-line language (see GridLines.tsx) instead of an unrelated
              visual metaphor. Tilts gently toward the pointer. */}
          <motion.div variants={fadeUp} className="flex justify-center lg:justify-end">
            <HeroGraphic />
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.a
          href="#about"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-16 inline-flex items-center gap-2 text-xs uppercase tracking-[2px] text-text-muted transition-colors hover:text-text-primary"
        >
          Scroll
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: EASE }}
            className="inline-block"
          >
            ↓
          </motion.span>
        </motion.a>
      </Container>
    </section>
  );
}
