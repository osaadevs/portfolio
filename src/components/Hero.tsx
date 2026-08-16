import { motion } from "framer-motion";
import { hero } from "../content";
import { Button, Container, EASE, StatusBadge, fadeUp, staggerContainer } from "./ui";
import { InteractiveHeadline } from "./InteractiveHeadline";

// Ambient layer: a slow, low-opacity azure aurora drifting behind the type.
// Purely decorative; MotionConfig strips the transform for reduced-motion.
function HeroAura() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45, x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{
          opacity: { duration: 1.2 },
          x: { duration: 22, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 26, repeat: Infinity, ease: "easeInOut" },
        }}
        className="absolute -right-32 top-1/3 h-[560px] w-[560px] rounded-full bg-accent/20 blur-[150px]"
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
        <motion.div variants={staggerContainer(0.08)} initial="hidden" animate="show">
          <motion.div variants={fadeUp}>
            <StatusBadge>{hero.badge}</StatusBadge>
          </motion.div>

          {/* The headline is the hero — full width, no competing column. */}
          <div className="mt-8">
            <InteractiveHeadline lines={hero.headlineLines} />
          </div>

          {/* Supporting row sits under the type, split left/right so the
              headline keeps the full width to itself. */}
          <div className="mt-12 flex flex-col gap-8 border-t border-border pt-8 md:flex-row md:items-start md:justify-between">
            <motion.p variants={fadeUp} className="max-w-[440px] text-lg leading-[1.7] text-text-secondary">
              {hero.subline}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 md:shrink-0">
              <Button href={hero.primaryCta.href} size="lg" glow>
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="ghost" size="lg" icon="download" download>
                {hero.secondaryCta.label}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.a
          href="#about"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="mt-14 inline-flex items-center gap-2 text-xs uppercase tracking-[2px] text-text-muted transition-colors hover:text-text-primary"
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
