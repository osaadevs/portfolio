import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { Icon, type IconName } from "./Icon";

// ---- Layout ---------------------------------------------------------------

// Horizontal padding is tied to the GridLines insets (see GridLines.tsx) so
// content always keeps a fixed 40px gap from the vertical guide lines rather
// than an independent max-width that can drift out of sync as the viewport
// resizes: sm insets the lines 40px -> content pads 80px; lg insets 80px ->
// content pads 120px (which also naturally caps content at 1200px inside the
// 1440px canvas, matching the Figma content column).
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full px-6 sm:px-20 lg:px-[120px] ${className}`}>{children}</div>;
}

export function Section({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`border-b border-border py-20 md:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

// ---- Motion -----------------------------------------------------------
// MotionConfig at the App root (reducedMotion="user") already strips
// transforms for prefers-reduced-motion users and falls back to opacity
// only, so these variants don't need their own media-query branching.

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const staggerContainer = (stagger = 0.08): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});

export function Reveal({
  children,
  className = "",
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

// ---- Section Header (Eyebrow + split-weight Heading) ----------------------

// Parses "A bit **about me**" into extralight/extrabold spans, matching the
// Figma split-weight heading treatment.
export function SplitHeading({ text, as: As = "h2" }: { text: string; as?: "h1" | "h2" }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  const Tag = As;
  return (
    <Tag className="max-w-2xl text-4xl leading-[1.15] tracking-[-1.6px] text-text-primary md:text-[46px] md:leading-[54px]">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-extrabold text-accent">
            {part}
          </span>
        ) : (
          <span key={i} className="font-extralight">
            {part}
          </span>
        ),
      )}
    </Tag>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-[13px] font-semibold uppercase tracking-[2px] text-accent">{children}</p>;
}

export function SectionHeader({
  eyebrow,
  heading,
  intro,
  as = "h2",
}: {
  eyebrow?: string;
  heading: string;
  intro?: string;
  as?: "h1" | "h2";
}) {
  return (
    <motion.div variants={fadeUp}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <div className={eyebrow ? "mt-4" : ""}>
        <SplitHeading text={heading} as={as} />
      </div>
      {intro ? <p className="mt-5 max-w-xl text-lg text-text-secondary">{intro}</p> : null}
    </motion.div>
  );
}

// ---- Button -----------------------------------------------------------

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  glow = false,
  icon,
  download,
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  glow?: boolean;
  icon?: IconName;
  download?: boolean;
}) {
  const sizeCls = size === "lg" ? "px-8 py-5 text-[15px]" : "px-6 py-3.5 text-sm";
  const variantCls =
    variant === "primary"
      ? "bg-accent text-on-accent hover:bg-accent-press"
      : "border border-border bg-bg-surface text-text-primary hover:border-text-muted";
  return (
    <motion.a
      href={href}
      download={download}
      whileHover={{ y: -1 }}
      whileTap={{ y: 0 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors ${sizeCls} ${variantCls} ${
        glow && variant === "primary" ? "shadow-[0_10px_28px_rgba(31,139,255,0.35)] hover:shadow-[0_12px_34px_rgba(31,139,255,0.5)]" : ""
      }`}
    >
      {children}
      {icon ? <Icon name={icon} className="h-4 w-4" /> : null}
    </motion.a>
  );
}

export function IconButton({ href, icon, label }: { href: string; icon: IconName; label: string }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      whileHover={{ y: -2 }}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-bg-elevated text-text-secondary transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <Icon name={icon} />
    </motion.a>
  );
}

// ---- Tag / Status Badge -------------------------------------------------

export function Tag({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-sm bg-bg-elevated px-3.5 py-2 text-sm ${
        muted ? "text-text-muted italic" : "text-text-secondary"
      }`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={fadeUp}
      className="inline-flex items-center gap-2.5 rounded-full bg-bg-elevated py-2.5 pl-4 pr-5"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
      </span>
      <span className="text-sm text-text-secondary">{children}</span>
    </motion.div>
  );
}

// ---- Fact Card / Skill Card / Cert Card ----------------------------------

export function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div variants={fadeUp} className="rounded-lg border border-border bg-bg-surface p-6">
      <dt className="text-sm text-text-muted">{label}</dt>
      <dd className="mt-3 text-base font-medium text-text-primary">{value}</dd>
    </motion.div>
  );
}

export function SkillCard({ title, tags }: { title: string; tags: string[] }) {
  return (
    <motion.div variants={fadeUp} className="rounded-lg border border-border bg-bg-surface p-7">
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </motion.div>
  );
}

export function CertCard({
  year,
  title,
  issuer,
  inProgress = false,
  as = "h3",
}: {
  year: string;
  title: string;
  issuer: string;
  inProgress?: boolean;
  as?: "h3" | "h4";
}) {
  const TitleTag = as;
  return (
    <motion.div variants={fadeUp} className="flex flex-col rounded-lg border border-border bg-bg-surface p-6">
      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm ${inProgress ? "text-text-muted" : "text-text-muted"}`}>{year}</span>
        {inProgress ? (
          <span className="rounded-full bg-bg-elevated px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1px] text-text-muted">
            In progress
          </span>
        ) : null}
      </div>
      <TitleTag className={`mt-3 text-lg font-semibold ${inProgress ? "text-text-muted" : "text-text-primary"}`}>
        {title}
      </TitleTag>
      <p className="mt-2 flex-1 text-sm text-text-secondary">{issuer}</p>
    </motion.div>
  );
}

// ---- Timeline Entry -------------------------------------------------------

export function TimelineEntry({
  period,
  role,
  org,
  note,
}: {
  period: string;
  role: string;
  org?: string;
  note?: string;
}) {
  return (
    <motion.li variants={fadeUp} className="border-l-2 border-border pl-6">
      <p className="text-xs font-semibold tracking-[1px] text-text-muted">{period}</p>
      <h4 className="mt-2 text-lg font-semibold text-text-primary">{role}</h4>
      {org ? <p className="mt-1 text-sm text-accent">{org}</p> : null}
      {note ? <p className="mt-3 text-[15px] leading-[1.6] text-text-secondary">{note}</p> : null}
    </motion.li>
  );
}

// ---- Contact Row ------------------------------------------------------

export function ContactRowItem({
  label,
  value,
  href,
  icon,
}: {
  label: string;
  value: string;
  href?: string;
  icon: IconName;
}) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-4 py-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-elevated text-text-muted">
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <span className="w-24 shrink-0 text-sm text-text-muted">{label}</span>
      {href ? (
        <a
          href={href}
          className="ml-auto truncate text-base text-text-primary transition-colors hover:text-accent"
        >
          {value}
        </a>
      ) : (
        <span className="ml-auto truncate text-base text-text-primary">{value}</span>
      )}
    </motion.div>
  );
}
