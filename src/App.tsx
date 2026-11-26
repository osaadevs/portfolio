import { lazy, Suspense, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { ScrollTrigger, startScroll } from "./lib";
import { TransitionProvider } from "./router";
import { Cursor } from "./ui/kit";
import { Loader } from "./scenes/Loader";
import { Nav } from "./scenes/Nav";
import { Footer } from "./scenes/Footer";
import Home from "./pages/Home";

// osa. Home is the short film (hero, introduction, selected work,
// expertise); the full index, case studies and the story have their own
// pages. Every page ends by lifting off the same footer.

const WorkIndex = lazy(() => import("./pages/WorkIndex"));
const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

function Pages() {
  const { pathname } = useLocation();
  useEffect(() => {
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(t);
  }, [pathname]);
  return (
    <Suspense fallback={<div className="h-[100svh] bg-night" />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<WorkIndex />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  useEffect(() => {
    startScroll();
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <TransitionProvider>
        <Loader />
        <Nav />
        {/* No background on main: each page paints its own and ends with a
            rounded edge that lifts off the footer underneath. */}
        <main className="relative z-10">
          <Pages />
        </main>
        <Footer />
        <Cursor />
      </TransitionProvider>
    </MotionConfig>
  );
}
