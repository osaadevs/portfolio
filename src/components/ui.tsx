import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { Icon, type IconName } from "./Icon";
import { TechIcon } from "./TechIcon";
import { TAG_ICON_MAP } from "./techIconData";

// ---- Layout ---------------------------------------------------------------

// Horizontal padding is tied to the GridLines insets (see GridLines.tsx) so
// content always keeps a fixed 40px gap from the vertical guide lines rather
// than an independent max-width that can drift out of sync as the viewport
// resizes: sm insets the lines 40px -> content pads 80px; lg insets 80px ->
// content pads 120px (which also naturally caps content at 1200px inside the
// 1440px canvas, matching the Figma content column).
// Content column. Its horizontal padding is intentionally larger than the
// GridLines inset (see GridLines.tsx) so text sits ~40px inside the vertical
// guide lines. max-w matches the GridLines frame so both stay aligned.
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1400px] px-6 sm:px-20 lg:px-[120px] ${className}`}>{children}</div>
  );
}

// Full-bleed section: the border-b spans the whole viewport width so the
// horizontal grid rule is continuous at every screen size, while the inner
// Container keeps the content centred and aligned to the vertical guides.
export function Section({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`border-b border-border py-16 md:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

// ---- Motion -----------------------------------------------------------
// MotionConfig at the App root (reducedMotion="user") already strips
// transforms for prefers-reduced-motion users and falls back to opacity
// only, so these variants don't need their own media-query branching.
//
// Signature easing = "Premium" personality from the motion-design skill:
// standard material decelerate curve, no overshoot, 0.4-0.6s.
export const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
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

// Parses "A bit **about me**" into two spans. Both halves share the same
// (bold) weight; only the colour changes — primary text, accent emphasis.
export function SplitHeading({ text, as: As = "h2" }: { text: string; as?: "h1" | "h2" }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  const Tag = As;
  return (
    <Tag className="max-w-2xl text-[30px] font-extrabold leading-[1.1] tracking-[-1px] text-text-primary md:text-[38px]">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-accent">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
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
  const label = typeof children === "string" ? children : null;
  const hasIcon = label !== null && label in TAG_ICON_MAP;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm bg-bg-elevated py-2 text-sm ${
        hasIcon ? "pl-2.5 pr-3.5" : "px-3.5"
      } ${muted ? "text-text-muted italic" : "text-text-secondary"}`}
    >
      {label ? <TechIcon label={label} className="h-4 w-4 shrink-0" /> : null}
      {children}
    </span>
  );
}

// `compact` shrinks it for use inside cards; `reveal` (default) opts into the
// fadeUp stagger used in the hero — pass reveal={false} outside a stagger
// container so it renders immediately instead of waiting for a "show" label.
export function StatusBadge({
  children,
  compact = false,
  reveal = true,
}: {
  children: ReactNode;
  compact?: boolean;
  reveal?: boolean;
}) {
  const dot = compact ? "h-2 w-2" : "h-2.5 w-2.5";
  return (
    <motion.div
      variants={reveal ? fadeUp : undefined}
      className={`inline-flex max-w-full items-center rounded-full bg-bg-elevated ${
        compact ? "gap-1.5 py-1.5 pl-2.5 pr-3" : "gap-2.5 py-2.5 pl-4 pr-5"
      }`}
    >
      <span className={`relative flex ${dot}`}>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75 motion-reduce:hidden" />
        <span className={`relative inline-flex rounded-full bg-accent ${dot}`} />
      </span>
      <span className={`text-text-secondary ${compact ? "text-xs" : "text-sm"}`}>{children}</span>
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

// ---- Contact Row ------------------------------------------------------
// A full row that is itself the link target (bigger hit area, clearer hover).

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
  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated text-text-secondary transition-colors group-hover:border-accent/50 group-hover:text-accent">
        <Icon name={icon} className="h-4 w-4" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-xs uppercase tracking-[1px] text-text-muted">{label}</span>
        <span className="truncate text-[15px] text-text-primary">{value}</span>
      </span>
      {href ? (
        <span className="ml-auto shrink-0 text-text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent">
          <Icon name="arrow-up-right" className="h-4 w-4" />
        </span>
      ) : null}
    </>
  );

  const shell = "group flex items-center gap-4 rounded-xl border border-border bg-bg-surface px-5 py-4 transition-colors hover:border-accent/40";

  return (
    <motion.div variants={fadeUp}>
      {href ? (
        <a href={href} className={shell} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
          {inner}
        </a>
      ) : (
        <div className={shell}>{inner}</div>
      )}
    </motion.div>
  );
}
