import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToChapter } from "../lib/chapterNavigation";

gsap.registerPlugin(ScrollTrigger);

export default function useEditorialMotion() {
  const root = useRef(null);
  useLayoutEffect(() => {
    const media = gsap.matchMedia(root.current);
    const opening = root.current.querySelector(".opening-experience");
    const stage = opening.querySelector(".opening-stage");
    const hero = stage.querySelector("#home");
    const interests = stage.querySelector("#interests");
    let disposed = false;

    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        desktop: "(min-width: 701px)",
        projectDesktop: "(min-width: 901px) and (min-height: 701px)",
      },
      (context) => {
        if (!context.conditions.motion) return;
        const desktop = context.conditions.desktop;
        let arrivalOffset = 0;
        const measure = () => {
          // Long mobile copy is read normally before the camera starts moving.
          arrivalOffset = Math.max(0, hero.offsetHeight - window.innerHeight);
          stage.style.setProperty("--arrival-offset", `${arrivalOffset}px`);
          stage.style.height = `${Math.max(hero.offsetHeight, arrivalOffset + interests.offsetHeight)}px`;
        };
        stage.classList.add("has-depth");
        measure();
        gsap.set(interests, { autoAlpha: 0 });
        const notify = (progress) => {
          opening.dataset.motionProgress = String(progress);
          hero.inert = progress > 0.06;
          interests.inert = progress < 0.98;
          window.dispatchEvent(new Event("portfolio:motion"));
        };
        const timeline = gsap.timeline({
          defaults: { duration: 0.88, ease: "power1.in" },
          onUpdate() {
            notify(this.progress());
          },
          scrollTrigger: {
            id: "opening-camera",
            trigger: opening,
            start: () => arrivalOffset,
            end: () => `+=${Math.round(window.innerHeight * 1.8)}`,
            pin: stage,
            pinSpacing: true,
            scrub: 0.45,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            onRefresh: (self) => {
              if (desktop)
                opening.style.top = `${innerHeight - opening.offsetHeight}px`;
              opening.dataset.scrollStart = String(self.start);
              opening.dataset.scrollEnd = String(self.end);
              notify(self.progress);
            },
          },
        });
        timeline
          .to(
            ".portfolio-title",
            {
              y: () => -innerHeight * 1.2,
              scale: 3.2,
              transformOrigin: "50% 100%",
            },
            0,
          )
          .to(
            ".portrait-composition",
            {
              x: () => -innerWidth * 0.72,
              y: () => innerHeight * 0.85,
              scale: 3.1,
              transformOrigin: "100% 0%",
            },
            0,
          )
          .to(
            ".hero-intro-copy",
            {
              x: () => innerWidth * 0.82,
              y: () => innerHeight * 0.8,
              scale: 2.6,
              transformOrigin: "0% 0%",
            },
            0,
          )
          .to(
            ".hero-paint-top",
            {
              x: () => innerWidth * 0.5,
              y: () => -innerHeight * 0.7,
              scale: 2.8,
            },
            0,
          )
          .to(
            ".hero-paint-bottom",
            {
              x: () => -innerWidth * 0.5,
              y: () => innerHeight * 0.75,
              scale: 2.8,
            },
            0,
          )
          .to(".top-meta", { y: () => -innerHeight * 0.6, scale: 1.8 }, 0)
          .to(".hero-baseline", { y: () => innerHeight * 0.7, scale: 1.8 }, 0)
          .to(
            ".editorial-hero .open-navigation",
            { x: () => -innerWidth * 0.3, scale: 1.8 },
            0,
          )
          .to(hero, { autoAlpha: 0, duration: 0.16, ease: "none" }, 0.78)
          .fromTo(
            interests,
            {
              scale: 0.14,

              transformOrigin: () => `50% ${innerHeight / 2}px`,
            },
            { scale: 1, duration: 0.82, ease: "sine.inOut" },
            0.18,
          );
        timeline.to(
          interests,
          { autoAlpha: 1, duration: 0.16, ease: "none" },
          0.18,
        );
        // Each complete frame has its own approach vector, then settles into the
        // editorial collage before the camera finishes arriving at the gallery.
        const approaches = [
          [-0.24, -0.3],
          [0.24, -0.26],
          [-0.3, 0.18],
          [-0.08, 0.34],
          [0.12, 0.32],
          [0.3, 0.15],
          [0.32, -0.2],
        ];
        timeline.fromTo(
          ".collage-frame",
          {
            x: (index) => innerWidth * approaches[index][0],
            y: (index) => innerHeight * approaches[index][1],
            rotation: (index) => [-5, 5, -7, 4, -4, 7, 3][index],
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.46,
            stagger: 0.022,
            ease: "power2.out",
          },
          0.38,
        );
        notify(timeline.scrollTrigger.progress);

        const projects = root.current.querySelector("#projects");
        // Hold the completed gallery behind the incoming paper, without adding
        // scroll space: the next chapter naturally travels up over the collage.
        if (desktop) opening.classList.add("has-overlap");
        if (desktop)
          opening.style.top = `${innerHeight - opening.offsetHeight}px`;
        const screens = [...projects.querySelectorAll(".project-screen")];
        let activeProject = -1;
        const announceProject = (index) => {
          screens.forEach((screen, i) => {
            screen.inert = i !== index;
          });
          if (activeProject === index) return;
          activeProject = index;
          projects.dataset.activeProject = String(index);
          window.dispatchEvent(
            new CustomEvent("portfolio:project", { detail: { index } }),
          );
        };
        if (context.conditions.projectDesktop) {
          projects.classList.add("has-project-stage");
          const duration = 5.05;
          const stops = [1.05, 2.8, 4.6];
          const drafting = gsap.timeline({
            onUpdate() {
              projects.dataset.draftProgress = String(this.progress());
              const time = this.time();
              announceProject(time < 2.05 ? 0 : time < 3.75 ? 1 : 2);
            },
            scrollTrigger: {
              id: "project-drafting",
              trigger: projects,
              start: "top top",
              end: () => `+=${innerHeight * 4.8}`,
              pin: true,
              scrub: 0.5,
              invalidateOnRefresh: true,
              onRefresh: (self) => {
                projects.dataset.scrollStart = String(self.start);
                projects.dataset.scrollEnd = String(self.end);
                projects.dataset.projectStops = JSON.stringify(
                  stops.map(
                    (time) =>
                      self.start + ((self.end - self.start) * time) / duration,
                  ),
                );
                projects.dataset.scrollReady = String(
                  self.start + ((self.end - self.start) * stops[0]) / duration,
                );
              },
            },
          });
          drafting
            .fromTo(
              ".project-panels",
              { autoAlpha: 0, xPercent: 0 },
              { autoAlpha: 1, duration: 0.45 },
              0.08,
            )
            .to(
              ".project-panels",
              { xPercent: -100, duration: 0.8, ease: "power1.inOut" },
              1.65,
            )
            .to(
              ".project-panels",
              { xPercent: -200, duration: 0.8, ease: "power1.inOut" },
              3.35,
            )
            .to({}, { duration: 0.9 }, 4.15);
          announceProject(0);
        }

        return () => {
          opening.classList.remove("has-overlap");
          opening.style.removeProperty("top");
          delete projects.dataset.scrollStart;
          delete projects.dataset.scrollEnd;
          delete projects.dataset.draftProgress;
          delete projects.dataset.scrollReady;
          delete projects.dataset.projectStops;
          delete projects.dataset.activeProject;
          projects.classList.remove("has-project-stage");
          screens.forEach((screen) => {
            screen.inert = false;
          });
          stage.classList.remove("has-depth");
          stage.style.removeProperty("height");
          stage.style.removeProperty("--arrival-offset");
          delete opening.dataset.scrollStart;
          delete opening.dataset.scrollEnd;
          delete opening.dataset.motionProgress;
          hero.inert = false;
          interests.inert = false;
          window.dispatchEvent(new Event("portfolio:motion"));
        };
      },
    );

    // Rebuild pin geometry after an orientation/viewport change. A simple
    // refresh can retain the old fixed top when the readable hero changes height.
    let resizeTimer;
    const rebuild = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!disposed) gsap.matchMediaRefresh();
      }, 180);
    };
    window.addEventListener("resize", rebuild);
    document.fonts.ready.then(() => {
      if (disposed) return;
      ScrollTrigger.refresh();
      const id = window.location.hash.slice(1);
      if (id && document.getElementById(id))
        scrollToChapter(id, { instant: true });
    });
    return () => {
      disposed = true;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", rebuild);
      media.revert();
    };
  }, []);
  return root;
}
