import { motion, type Variants } from "framer-motion";
import { hero } from "../content";
import { Button, Container, EASE, StatusBadge, fadeUp, staggerContainer } from "./ui";
import { TypingKeyboard } from "./TypingKeyboard";

// Bottom-up letters reveal: each glyph rises from a slight offset while
// fading in, staggered per character, with a small extra delay between the
// two headline lines so the cascade reads top to bottom.
const letterEnter: Variants = {
  hidden: { opacity: 0, y: 46 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.18, 1, 0.32, 1] } },
};

function AnimatedLine({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <motion.span variants={staggerContainer(0.022)} className="block">
      {parts.map((part, i) => {
        const bold = i % 2 === 1;
        // Split into words vs. whitespace runs: letters within a word are
        // wrapped in an atomic, non-breaking box so the reveal can't split
        // a word mid-letter at narrow viewports, while the plain-text
        // spaces between words stay normal line-wrap points.
        const tokens = part.match(/\S+|\s+/g) ?? [];
        return (
          <span key={i} className={bold ? undefined : "text-text-muted"}>
            {tokens.map((token, t) =>
              /\s/.test(token) ? (
                token
              ) : (
                <span key={t} className="inline-block whitespace-nowrap">
                  {token.split("").map((char, j) => (
                    <motion.span key={j} variants={letterEnter} className="inline-block">
                      {char}
                    </motion.span>
                  ))}
                </span>
              ),
            )}
          </span>
        );
      })}
    </motion.span>
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
              variants={staggerContainer(0.18)}
              className="mt-6 max-w-3xl text-[44px] font-extrabold leading-[1.03] tracking-[-1.5px] text-text-primary sm:text-6xl md:text-[68px] md:leading-[1.02] md:tracking-[-2.5px]"
            >
              {hero.headlineLines.map((line, i) => (
                <AnimatedLine key={i} text={line} />
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

          <motion.div variants={fadeUp} className="flex justify-center lg:justify-end">
            <div className="h-[320px] w-full max-w-[600px] sm:h-[380px] md:h-[440px]" aria-hidden="true">
              <TypingKeyboard scale={0.78} />
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
