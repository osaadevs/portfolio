import { MotionConfig } from "framer-motion";
import { Route, Routes } from "react-router-dom";
import { About } from "./components/About";
import { Certifications } from "./components/Certifications";
import { Contact } from "./components/Contact";
import { ExperienceEducation } from "./components/ExperienceEducation";
import { Footer } from "./components/Footer";
import { GridLines } from "./components/GridLines";
import { Hero } from "./components/Hero";
import { NavBar } from "./components/NavBar";
import { ProjectsPage } from "./components/ProjectsPage";
import { SmoothScroll } from "./components/SmoothScroll";
import { Skills } from "./components/Skills";
import { Work } from "./components/Work";

function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Work />
      <ExperienceEducation />
      <Certifications />
      <Contact />
    </main>
  );
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        {/* Fixed grid frame behind everything */}
        <GridLines />
        {/* Content sits above the grid */}
        <div className="relative z-10">
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
          </Routes>
          <Footer />
        </div>
      </SmoothScroll>
    </MotionConfig>
  );
}

export default App;
