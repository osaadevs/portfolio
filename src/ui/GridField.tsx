import { useEffect, useRef } from "react";
import { FINE, REDUCED } from "../lib";

// The hero's canvas: a layout grid like a design tool's, with registration
// crosses on every fourth line. Cells warm up under the pointer and cool
// off behind it, leaving a short trail. On touch screens, and when the
// pointer is still, a few cells light on their own so the grid never sits
// dead. Drawn to a 2D canvas only while the hero is on screen.

export function GridField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let cell = 56;
    let cols = 0;
    let rows = 0;
    let heat = new Float32Array(0);
    let ox = 0;
    let oy = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const size = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cell = w < 640 ? 38 : w < 1100 ? 48 : 60;
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      // Centre the grid so the edges get equal partial cells.
      ox = ((w % cell) - cell) / 2;
      oy = ((h % cell) - cell) / 2;
      heat = new Float32Array(cols * rows);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const warm = (cx: number, cy: number, v: number) => {
      if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return;
      const i = cy * cols + cx;
      heat[i] = Math.max(heat[i], v);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // Lit cells.
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          const v = heat[y * cols + x];
          if (v < 0.01) continue;
          ctx.fillStyle = `rgba(127,216,240,${(v * 0.22).toFixed(3)})`;
          ctx.fillRect(ox + x * cell + 1, oy + y * cell + 1, cell - 1, cell - 1);
        }
      // Lines.
      ctx.beginPath();
      for (let x = 0; x <= cols; x++) {
        const px = Math.round(ox + x * cell) + 0.5;
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
      }
      for (let y = 0; y <= rows; y++) {
        const py = Math.round(oy + y * cell) + 0.5;
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
      }
      ctx.strokeStyle = "rgba(238,241,246,0.07)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // Registration crosses.
      ctx.beginPath();
      for (let x = 0; x <= cols; x += 4)
        for (let y = 0; y <= rows; y += 4) {
          const px = Math.round(ox + x * cell) + 0.5;
          const py = Math.round(oy + y * cell) + 0.5;
          ctx.moveTo(px - 5, py);
          ctx.lineTo(px + 6, py);
          ctx.moveTo(px, py - 5);
          ctx.lineTo(px, py + 6);
        }
      ctx.strokeStyle = "rgba(238,241,246,0.28)";
      ctx.stroke();
    };

    size();
    if (REDUCED) {
      window.addEventListener("resize", size);
      return () => window.removeEventListener("resize", size);
    }

    let raf = 0;
    let visible = true;
    let lastMove = 0;
    let lastSpark = 0;
    const loop = (t: number) => {
      raf = 0;
      if (!visible) return;
      // Idle sparkle: always on touch, otherwise after a second of stillness.
      if ((!FINE || t - lastMove > 1000) && t - lastSpark > 110) {
        lastSpark = t;
        warm(Math.floor(Math.random() * cols), Math.floor(Math.random() * rows), 0.55 + Math.random() * 0.45);
      }
      for (let i = 0; i < heat.length; i++) heat[i] *= 0.955;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - r.left - ox) / cell);
      const y = Math.floor((e.clientY - r.top - oy) / cell);
      lastMove = performance.now();
      warm(x, y, 1);
      warm(x + 1, y, 0.35);
      warm(x - 1, y, 0.35);
      warm(x, y + 1, 0.35);
      warm(x, y - 1, 0.35);
      start();
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    window.addEventListener("resize", size);
    window.addEventListener("pointermove", onMove, { passive: true });
    start();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none size-full ${className}`} />;
}
