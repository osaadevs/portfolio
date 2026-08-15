import { MotionConfig } from "framer-motion";
import { About } from "./components/About";
import { Certifications } from "./components/Certifications";
import { Contact } from "./components/Contact";
import { ExperienceEducation } from "./components/ExperienceEducation";
import { Footer } from "./components/Footer";
import { GridLines } from "./components/GridLines";
import { Hero } from "./components/Hero";
import { NavBar } from "./components/NavBar";
import { Skills } from "./components/Skills";
import { Work } from "./components/Work";

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative">
        <GridLines />
        <div className="relative z-0 mx-auto max-w-[1440px]">
          <NavBar />
          <main>
            <Hero />
            <About />
            <Skills />
            <Work />
            <ExperienceEducation />
            <Certifications />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
