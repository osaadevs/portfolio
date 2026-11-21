import { Link } from "react-router-dom";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { OSA_PATHS, OSA_VIEWBOX_STR } from "../brand/osa";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];


export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 400 && y > prev + 2 ? true : y < prev - 2 ? false : hidden);
  });

  return (
    <motion.header
      data-inspect="Nav"
      className="fixed inset-x-0 top-0 z-[60] px-3 pt-3 sm:px-5"
      animate={{ y: hidden ? "-120%" : "0%" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="mx-auto flex h-14 max-w-[1400px] items-center justify-between rounded-full border border-line bg-bg/75 pl-5 pr-2 backdrop-blur-xl">
        <Link to="/" aria-label="osa, home" data-cursor="Home" className="block">
          <svg viewBox={OSA_VIEWBOX_STR} className="h-[22px] w-auto fill-ink" aria-hidden="true">
            <path d={OSA_PATHS.o} />
            <path d={OSA_PATHS.s} />
            <path d={OSA_PATHS.a} />
          </svg>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`rounded-full px-2.5 py-2 text-sm font-medium text-muted transition-colors hover:text-ink sm:px-3 ${l.label === "Work" ? "hidden sm:inline" : ""}`}
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/projects"
            className="ml-1 whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg transition-colors hover:bg-accent hover:text-on-accent"
          >
            All work
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
