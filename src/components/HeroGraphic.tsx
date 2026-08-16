import { useEffect, useRef } from "react";

// Interactive particle constellation. Nodes drift slowly and link to nearby
// neighbours; the cursor pulls a live web of accent-blue links toward it and
// gently pushes nearby nodes aside, so the field feels alive and responsive
// rather than a static decoration. Canvas 2D (no WebGL), pointer-driven,
// and frozen to a single static frame under prefers-reduced-motion.

const NODE_COUNT = 46;
const LINK_DIST = 108; // node-to-node link threshold (px)
const MOUSE_DIST = 150; // cursor influence radius (px)

const COLORS = {
  node: "rgba(120, 130, 145, 0.55)",
  link: "90, 100, 115", // rgb, alpha applied per-link
  accent: "31, 139, 255",
};

type Node = { x: number; y: number; vx: number; vy: number };

export function HeroGraphic() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const nodes: Node[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    function seed() {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
        });
      }
    }

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (nodes.length === 0) seed();
    }

    function step() {
      ctx!.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;

          // Gentle push away from the cursor.
          if (mouse.active) {
            const dx = n.x - mouse.x;
            const dy = n.y - mouse.y;
            const d = Math.hypot(dx, dy);
            if (d < MOUSE_DIST && d > 0.01) {
              const force = (1 - d / MOUSE_DIST) * 0.6;
              n.x += (dx / d) * force;
              n.y += (dy / d) * force;
            }
          }
        }
      }

      // Node-to-node links.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.5;
            ctx!.strokeStyle = `rgba(${COLORS.link}, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }

      // Cursor links + node highlight.
      for (const n of nodes) {
        let near = false;
        if (mouse.active) {
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (d < MOUSE_DIST) {
            near = true;
            const alpha = (1 - d / MOUSE_DIST) * 0.9;
            ctx!.strokeStyle = `rgba(${COLORS.accent}, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(n.x, n.y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.stroke();
          }
        }
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, near ? 2.6 : 1.8, 0, Math.PI * 2);
        ctx!.fillStyle = near ? `rgba(${COLORS.accent}, 0.95)` : COLORS.node;
        ctx!.fill();
      }

      // Cursor node.
      if (mouse.active) {
        ctx!.beginPath();
        ctx!.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${COLORS.accent}, 1)`;
        ctx!.fill();
      }
    }

    let raf = 0;
    function loop() {
      step();
      raf = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    if (reduce) {
      step(); // single static frame
    } else {
      raf = requestAnimationFrame(loop);
    }

    function onMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }

    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative h-[300px] w-full max-w-[440px] touch-none sm:h-[360px] md:h-[420px]"
      style={{
        WebkitMaskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
        maskImage: "radial-gradient(ellipse at center, black 55%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
