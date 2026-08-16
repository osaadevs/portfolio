import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { nav } from "../content";
import { Button } from "./ui";

export function NavBar() {
  const [active, setActive] = useState<string>("");
  const location = useLocation();
  const onHome = location.pathname === "/";

  useEffect(() => {
    if (!onHome) {
      setActive("");
      return;
    }
    const sectionIds = ["about", "skills", "work", "experience", "certifications", "contact"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-20 flex justify-center px-4 pt-6"
    >
      <nav className="flex items-center gap-6 rounded-full border border-border bg-bg-base/70 px-3 py-2 pl-6 backdrop-blur-md md:gap-8">
        <a href="#hero" aria-label={nav.logotype} className="shrink-0">
          <img src="/signature.png" alt={nav.logotype} className="h-8 w-auto sm:h-9" />
        </a>
        <ul className="hidden items-center gap-6 md:flex">
          {nav.links.map((link) => {
            const isActive = active === link.href.replace("#", "");
            const cls = `text-[15px] font-medium transition-colors ${
              isActive ? "text-accent" : "text-text-secondary hover:text-text-primary"
            }`;
            return (
              <li key={link.label} className="relative">
                <a href={link.href} className={cls}>
                  {link.label}
                </a>
                {isActive ? (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
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
