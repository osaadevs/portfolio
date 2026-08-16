import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import { hero } from "../content";
import { Button, Container, EASE, StatusBadge, fadeUp, staggerContainer } from "./ui";

const HeroScene = lazy(() => import("./HeroScene").then((m) => ({ default: m.HeroScene })));

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

// Soft static glow shown while the 3D chunk (react-three-fiber + three) is
// still downloading/hydrating, so the hero never shows an empty gap.
function ScenePlaceholder() {
  return <div className="h-full w-full animate-pulse rounded-full bg-accent/10 blur-2xl" />;
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

          {/* Interactive 3D artifact — replaces the headshot placeholder.
              Floats free (no card frame) so it reads as an object in the
              scene rather than boxed content; follows the pointer subtly. */}
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 lg:items-end">
            <div className="h-[280px] w-full max-w-[380px] cursor-grab active:cursor-grabbing sm:h-[340px] md:h-[400px]">
              <Suspense fallback={<ScenePlaceholder />}>
                <HeroScene />
              </Suspense>
            </div>
            <div className="text-center lg:text-right">
              <p className="text-lg font-semibold text-text-primary">{hero.name}</p>
              <p className="text-sm text-text-secondary">{hero.title}</p>
            </div>
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
