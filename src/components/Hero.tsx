import { motion } from "framer-motion";
import { hero } from "../content";
import { Button, Container, EASE, StatusBadge, fadeUp, staggerContainer } from "./ui";

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
          className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]"
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

          <motion.div
            variants={fadeUp}
            className="flex flex-row items-center gap-4 lg:flex-col lg:items-end lg:text-right"
          >
            {/* Placeholder headshot — swap for the real export: <img src="/headshot.webp" alt={hero.name} ... /> */}
            <div
              role="img"
              aria-label={`${hero.name} — headshot pending`}
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated text-center text-[11px] leading-tight text-text-muted"
            >
              Photo
              <br />
              pending
            </div>
            <div>
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
