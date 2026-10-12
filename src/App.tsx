import { MotionConfig } from "motion/react";
import Nav from "./components/Nav";
import ScrollProgress from "./components/ScrollProgress";
import Hero from "./components/Hero";
import Work from "./components/Work";
import About from "./components/About";
import Ecosystem from "./components/Ecosystem";
import Playground from "./components/Playground";
import Background from "./components/Background";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    // "user" makes Motion drop transform and layout animations when the OS asks for reduced motion.
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero />
        <Work />
        <About />
        <Ecosystem />
        <Playground />
        <Background />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
