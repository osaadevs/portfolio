import { MotionConfig } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import { About } from "./components/About";
import { ProjectModalProvider } from "./components/ProjectModal";
import { SmoothScroll } from "./components/SmoothScroll";
import { AllWork } from "./nib/AllWork";
import { FeaturedWork } from "./nib/FeaturedWork";
import { Finale } from "./nib/Finale";
import { Hero } from "./nib/Hero";
import { Inspect } from "./nib/Inspect";
import { Loader } from "./nib/Loader";
import { Nav } from "./nib/Nav";
import { NibCursor } from "./nib/NibCursor";
import { WorkIndex } from "./nib/WorkIndex";

function Home() {
  return (
    <main>
      <Hero />
      <FeaturedWork />
      <WorkIndex />
      {/* Legacy About, re-skinned by the palette tokens until phase 2 replaces it. */}
      <About />
    </main>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <ProjectModalProvider>
          <div className="grain">
            <Loader />
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<AllWork />} />
            </Routes>
            <Finale />
            <Inspect />
            <NibCursor />
          </div>
        </ProjectModalProvider>
      </SmoothScroll>
    </MotionConfig>
  );
}

export default App;
