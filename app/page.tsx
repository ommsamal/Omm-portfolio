import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import BackToTop from "@/components/BackToTop";
import MotionProvider from "@/components/MotionProvider";
import { About, Skills, Experience, Education, Achievements, Contact, Footer } from "@/components/Sections";

export default function Home() {
  return (
    <MotionProvider>
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </MotionProvider>
  );
}
