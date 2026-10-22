import { useEffect, useRef, useState } from "react";
import { chapters } from "./data/editorial";
import HeroSection from "./sections/HeroSection";
import InterestsSection from "./sections/InterestsSection";
import ProjectsSection from "./sections/ProjectsSection";
import AboutSection from "./sections/AboutSection";
import ContactSection from "./sections/ContactSection";
import SideNavigation from "./components/SideNavigation";
import InteractionCursor from "./components/InteractionCursor";
import useEditorialMotion from "./hooks/useEditorialMotion";
import { scrollToChapter } from "./lib/chapterNavigation";
export default function App() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const triggerRef = useRef(null);
  const root = useEditorialMotion();
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = chapters[0].id;
      for (const chapter of chapters) {
        if (chapter.id === "home" || chapter.id === "interests") continue;
        if (
          document.getElementById(chapter.id).getBoundingClientRect().top <=
          innerHeight * 0.45
        )
          current = chapter.id;
      }
      if (current === "home") {
        const opening = document.querySelector(".opening-experience");
        current = opening?.dataset.scrollEnd
          ? Number(opening.dataset.motionProgress) >= 0.98
            ? "interests"
            : "home"
          : document.getElementById("interests").getBoundingClientRect().top <=
              innerHeight * 0.45
            ? "interests"
            : "home";
      }
      if (
        window.scrollY + innerHeight >=
        document.documentElement.scrollHeight - 2
      )
        current = "contact";
      setActive(current);
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    window.addEventListener("portfolio:motion", scroll);
    return () => {
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      window.removeEventListener("portfolio:motion", scroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <>
      <InteractionCursor />
      <a className="skip-link" href="#home">
        Skip to content
      </a>
      <button
        className={`persistent-open ${active === "home" ? "at-home" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-controls="portfolio-navigation"
        aria-expanded={open}
        disabled={open}
      >
        Open <span>↗</span>
      </button>
      <SideNavigation
        open={open}
        onClose={() => setOpen(false)}
        active={active}
        triggerRef={triggerRef}
      />
      <main
        ref={root}
        className="portfolio-canvas"
        onClick={(event) => {
          const link = event.target.closest('a[href^="#"]');
          if (
            !link ||
            event.defaultPrevented ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          const id = link.hash.slice(1);
          if (!chapters.some((chapter) => chapter.id === id)) return;
          event.preventDefault();
          scrollToChapter(id);
        }}
      >
        <div className="opening-experience">
          <div className="opening-stage">
            <HeroSection
              onOpen={() => setOpen(true)}
              triggerRef={triggerRef}
              open={open}
            />
            <InterestsSection />
          </div>
        </div>
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  );
}
