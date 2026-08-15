import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { nav } from "../content";
import { Button } from "./ui";

export function NavBar() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const sectionIds = nav.links.map((l) => l.href.replace("#", ""));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-20 flex justify-center pt-6"
    >
      <nav className="flex items-center gap-8 rounded-full border border-border bg-bg-base/80 px-3 py-2 pl-6 backdrop-blur">
        <span className="whitespace-nowrap text-[17px] italic tracking-[-0.2px] text-text-primary">
          {nav.logotype}
        </span>
        <ul className="hidden items-center gap-6 md:flex">
          {nav.links.map((link) => {
            const isActive = active === link.href.replace("#", "");
            return (
              <li key={link.label} className="relative">
                <a
                  href={link.href}
                  className={`text-[15px] font-medium transition-colors ${
                    isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </a>
                {isActive ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                    transition={{ duration: 0.25 }}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
        <Button href="#contact" size="md">
          {nav.cta}
        </Button>
      </nav>
    </motion.header>
  );
}
