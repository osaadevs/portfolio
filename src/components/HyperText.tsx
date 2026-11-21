import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MotionProps, Variants } from "framer-motion";

// Magic UI's "hyper-text": each character scrambles through random glyphs
// before settling on its final letter. Adapted from the shadcn/Magic UI
// registry item to this project's conventions — relative imports, the
// framer-motion package that's already a dependency (instead of
// `motion/react`), and a plain className/style API rather than a `cn` util.

type CharacterSet = string[] | readonly string[];

interface HyperTextProps extends MotionProps {
  /** The text to animate. */
  children: string;
  /** Duration of the full scramble, in ms. */
  duration?: number;
  /** Delay before the animation starts, in ms. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Element to render as. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Start the scramble when the element scrolls into view. */
  startOnView?: boolean;
  /** Re-run the scramble on hover. */
  animateOnHover?: boolean;
  /** Glyph pool to scramble through. */
  characterSet?: CharacterSet;
}

const DEFAULT_CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const getRandomInt = (max: number) => Math.floor(Math.random() * max);

export function HyperText({
  children,
  duration = 800,
  delay = 0,
  className,
  style,
  as = "div",
  startOnView = false,
  animateOnHover = true,
  characterSet = DEFAULT_CHARACTER_SET,
  ...props
}: HyperTextProps) {
  const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div;

  const [displayText, setDisplayText] = useState<string[]>(() => children.split(""));
  const [isAnimating, setIsAnimating] = useState(false);
  const iterationCount = useRef(0);
  const elementRef = useRef<HTMLElement>(null);

  const handleAnimationTrigger = () => {
    if (animateOnHover && !isAnimating) {
      iterationCount.current = 0;
      setIsAnimating(true);
    }
  };

  // Kick off on mount (or on scroll into view when requested).
  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => setIsAnimating(true), delay);
      return () => clearTimeout(startTimeout);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsAnimating(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "-30% 0px -30% 0px" },
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [delay, startOnView]);

  // Drive the scramble.
  useEffect(() => {
    if (!isAnimating) return;

    const maxIterations = children.length;
    const startTime = performance.now();
    let animationFrameId: number;

    const animate = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(1, elapsed / duration);

      iterationCount.current = progress * maxIterations;

      setDisplayText((current) =>
        current.map((letter, index) =>
          letter === " "
            ? letter
            : index <= iterationCount.current
              ? children[index]
              : characterSet[getRandomInt(characterSet.length)],
        ),
      );

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [children, duration, isAnimating, characterSet]);

  const variants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <MotionComponent
      ref={elementRef as never}
      className={className}
      style={{ display: "inline-block", whiteSpace: "pre", ...style }}
      onMouseEnter={handleAnimationTrigger}
      {...props}
    >
      <AnimatePresence>
        {displayText.map((letter, index) => (
          <motion.span
            key={index}
            variants={variants}
            initial="hidden"
            animate="visible"
            style={{ display: "inline-block", fontVariantNumeric: "tabular-nums" }}
          >
            {letter.toUpperCase()}
          </motion.span>
        ))}
      </AnimatePresence>
    </MotionComponent>
  );
}
