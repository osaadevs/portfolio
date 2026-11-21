import { type PointerEvent, type ReactNode, useCallback, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

// Cursor-tracked spotlight border, adapted from magicui.design's
// "magic-card" registry item down to the one mode this site uses — their
// "orb" mode and next-themes light/dark switch don't apply here (fixed dark
// theme, no toggle) — and reskinned from the demo's purple/pink to the
// site's own accent blue.
//
// The border itself is a CSS trick, not a real 1px border: a transparent
// border ring is painted with a radial gradient clipped to the border-box
// (centered on the cursor, fading to the plain border color at the edges),
// while a solid surface-colored fill sits on the padding-box on top of it —
// so only the ring itself picks up the gradient's colors. That means
// `className` must not carry padding (it would shift the inset-px mask
// layers off the border ring) — put padding/layout on `contentClassName`
// instead, which lands on the actual content wrapper.

interface MagicCardProps {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
  gradientSize?: number;
  gradientFrom?: string;
  gradientTo?: string;
  gradientColor?: string;
  gradientOpacity?: number;
}

export function MagicCard({
  children,
  className = "",
  contentClassName = "flex h-full flex-col",
  gradientSize = 200,
  gradientFrom = "var(--color-accent)",
  gradientTo = "var(--color-accent-press)",
  gradientColor = "var(--color-accent)",
  gradientOpacity = 0.18,
}: MagicCardProps) {
  const mouseX = useMotionValue(-gradientSize);
  const mouseY = useMotionValue(-gradientSize);

  const reset = useCallback(() => {
    mouseX.set(-gradientSize);
    mouseY.set(-gradientSize);
  }, [mouseX, mouseY, gradientSize]);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    },
    [mouseX, mouseY],
  );

  // Mouse can leave the element without a pointerleave (e.g. the page
  // itself loses focus, or the cursor exits through a child during a fast
  // move) — catch that at the window level so the glow doesn't get stuck on.
  useEffect(() => {
    const onGlobalPointerOut = (e: globalThis.PointerEvent) => {
      if (!e.relatedTarget) reset();
    };
    window.addEventListener("pointerout", onGlobalPointerOut);
    return () => window.removeEventListener("pointerout", onGlobalPointerOut);
  }, [reset]);

  return (
    <motion.div
      className={`group relative isolate overflow-hidden border border-transparent ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{
        background: useMotionTemplate`
          linear-gradient(var(--color-bg-surface) 0 0) padding-box,
          radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
            ${gradientFrom},
            ${gradientTo},
            var(--color-border) 100%
          ) border-box
        `,
      }}
    >
      <div className="absolute inset-px z-0 bg-bg-surface" />
      <motion.div
        className="pointer-events-none absolute inset-px z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          opacity: gradientOpacity,
          background: useMotionTemplate`
            radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
              ${gradientColor},
              transparent 100%
            )
          `,
        }}
      />
      <div className={`relative z-[2] ${contentClassName}`}>{children}</div>
    </motion.div>
  );
}
