import { motion } from "framer-motion";
import { hero } from "../content";
import { Button, Container, StatusBadge, fadeUp, staggerContainer } from "./ui";

function SplitLine({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <span key={i}>{part}</span> : <span key={i} className="text-text-muted">{part}</span>))}
    </>
  );
}

export function Hero() {
  return (
    <section id="hero" className="border-b border-border pb-12 pt-24 md:pt-32">
      <Container>
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_auto]"
        >
          <div>
            <StatusBadge>{hero.badge}</StatusBadge>

            <motion.h1
              variants={fadeUp}
              className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-[-2px] text-text-primary sm:text-6xl md:text-[86px] md:leading-[92px] md:tracking-[-3.5px]"
            >
              {hero.headlineLines.map((line, i) => (
                <span key={i} className="block">
                  <SplitLine text={line} />
                </span>
              ))}
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-8 max-w-[470px] text-lg leading-[1.7] text-text-secondary">
              {hero.subline}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
              <Button href={hero.primaryCta.href} size="lg" glow>
                {hero.primaryCta.label}
              </Button>
              <Button href={hero.secondaryCta.href} variant="ghost" size="lg" icon="download" download>
                {hero.secondaryCta.label}
              </Button>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} className="flex flex-row items-center gap-4 lg:flex-col lg:items-end lg:text-right">
            {/* Placeholder headshot — swap for the real export: <img src="/headshot.webp" alt={hero.name} ... /> */}
            <div
              role="img"
              aria-label={`${hero.name} — headshot pending`}
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated text-[11px] text-text-muted"
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
      </Container>

      <Container className="mt-16">
        <motion.ul
          variants={staggerContainer(0.05)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap gap-3 border-t border-border pt-8"
        >
          {hero.credentials.map((item) => (
            <motion.li key={item} variants={fadeUp} className="rounded-full border border-border px-5 py-3 text-sm text-text-secondary">
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </Container>
    </section>
  );
}
