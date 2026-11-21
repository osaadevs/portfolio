import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

// smoothui's "focus-blur-resolve" text animation, adapted from the
// registry item (smoothui.dev/r/focus-blur-resolve) to this project's
// stack — the framer-motion package that's already a dependency, instead
// of `motion/react`. The text pulls from a heavy blur to crisp with a
// subtle upward drift and scale settle: a deliberate focus-pull.

export interface FocusBlurResolveProps {
  children: ReactNode;
  className?: string;
  /** Accessible label — falls back to string children when omitted. */
  label?: string;
  /** Delay before the animation starts, in milliseconds. */
  delay?: number;
  /** Animate only once the text scrolls into view. */
  triggerOnView?: boolean;
}

const DURATION_S = 0.76;
const MS = 1000;
// Smooth deceleration — premium focus-pull ease-out.
const EASE = [0.22, 1, 0.36, 1] as const;

export function FocusBlurResolve({
  children,
  className,
  label,
  delay = 0,
  triggerOnView = true,
}: FocusBlurResolveProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const shouldReduceMotion = useReducedMotion();
  const play = (!triggerOnView || inView) && !shouldReduceMotion;

  const ariaLabel = label ?? (typeof children === "string" ? children : undefined);

  return (
    <span aria-label={ariaLabel} className={className} ref={ref}>
      <motion.span
        aria-hidden="true"
        style={{ display: "inline-block", willChange: "filter, transform, opacity" }}
        initial={
          shouldReduceMotion
            ? { filter: "blur(0px)", opacity: 1, scale: 1, y: 0 }
            : { filter: "blur(14px)", opacity: 0, scale: 1.01, y: 14 }
        }
        animate={play ? { filter: "blur(0px)", opacity: 1, scale: 1, y: 0 } : undefined}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { delay: delay / MS, duration: DURATION_S, ease: EASE }
        }
      >
        {children}
      </motion.span>
    </span>
  );
}
