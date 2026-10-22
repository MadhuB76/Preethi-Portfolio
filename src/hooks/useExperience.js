import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// One owner for the scene transforms. All positions use the same 0–100 timeline.
export default function useExperience(root) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1100px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)",
      () => {
        const element = root.current;
        element.classList.add("is-choreographed");
        const select = gsap.utils.selector(element);
        const scenes = select(".story-scene");
        const room = select(".opening-scenes");
        const hero = select(".hero-scene");
        const gallery = select(".gallery-scene");
        let wallRadius = element.clientWidth / 2;
        // Derive the room directly from time, including its equivalent flat end state.
        // This avoids stale zero-duration reset values when reversing or resizing.
        const renderRoom = (beat) => {
          const turn = gsap.utils.clamp(0, 1, (beat - 3) / 15);
          if (turn < 1) {
            gsap.set(room, { rotationY: -90 * turn, z: -wallRadius });
            gsap.set(hero, {
              rotationY: 0,
              z: wallRadius,
              xPercent: 0,
              autoAlpha: 1,
            });
            gsap.set(gallery, {
              rotationY: 90,
              x: wallRadius,
              transformOrigin: "center center",
            });
          } else {
            gsap.set(room, { rotationY: 0, z: 0 });
            gsap.set(hero, {
              rotationY: 0,
              z: 0,
              xPercent: -100,
              autoAlpha: 0,
            });
            gsap.set(gallery, { rotationY: 0, x: 0 });
          }
        };
        let timeline;
        timeline = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate() {
            renderRoom(this.time());
          },
          scrollTrigger: {
            trigger: element,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onRefresh: () => {
              wallRadius = element.clientWidth / 2;
              renderRoom(timeline?.time() ?? 0);
            },
            onUpdate: (self) => {
              element.style.setProperty("--progress", self.progress);
              scenes.forEach((scene, index) => {
                const ranges = [
                  [0, 0.16],
                  [0.12, 0.36],
                  [0.32, 0.54],
                  [0.49, 0.71],
                  [0.66, 0.88],
                  [0.83, 1.01],
                ];
                scene.inert = !(
                  self.progress >= ranges[index][0] &&
                  self.progress < ranges[index][1]
                );
              });
            },
          },
        });
        // Two equal walls share an edge. Rotate their room, never the walls independently.
        gsap.set(room, {
          xPercent: 0,
          autoAlpha: 1,
          transformOrigin: "center center",
        });
        gsap.set(select(".project-scene"), { xPercent: 110 });
        gsap.set(select(".contact-scene"), { yPercent: 105 });
        timeline
          .to({}, { duration: 100 }, 0)
          .to(
            select(".wall-frame"),
            {
              x: (i) => (i - 2.5) * 125,
              y: (i) => (2 - i) * 65,
              rotation: -8,
              duration: 12,
            },
            27,
          )
          .to(
            select(".opening-scenes"),
            { xPercent: -55, autoAlpha: 0, duration: 12 },
            30,
          )
          .to(select(".project-scene-0"), { xPercent: 0, duration: 12 }, 30)
          .to(
            select(".spatial-rule"),
            { rotation: -24, scale: 1.3, xPercent: -8, duration: 17 },
            26,
          );
        [0, 1, 2].forEach((index) => {
          const scene = select(`.project-scene-${index}`);
          const start = 33 + index * 17;
          timeline.fromTo(
            select(`.project-scene-${index} .image-plane`),
            { y: 20 },
            { y: -16, duration: 20 },
            start,
          );
          if (index < 2) {
            timeline
              .to(scene, { xPercent: -105, duration: 12 }, start + 14)
              .to(
                select(`.project-scene-${index + 1}`),
                { xPercent: 0, duration: 12 },
                start + 14,
              );
          }
        });
        timeline
          .to(
            select(".project-scene-2 .image-plane"),
            { xPercent: 90, rotation: 9, duration: 14 },
            80,
          )
          .to(select(".project-scene-2"), { yPercent: -100, duration: 14 }, 83)
          .to(select(".contact-scene"), { yPercent: 0, duration: 14 }, 83)
          .to(
            select(".spatial-rule"),
            { rotation: 0, scale: 1, y: 240, duration: 16 },
            82,
          )
          .fromTo(
            select(".footer-illustration path"),
            { strokeDasharray: 1800, strokeDashoffset: 1800 },
            { strokeDashoffset: 0, duration: 12 },
            87,
          );
        renderRoom(timeline.time());

        // Anchor positions are derived from the same timeline, including keyboard navigation.
        const navigate = (event) => {
          const link = event.target.closest("a[data-beat]");
          if (!link) return;
          event.preventDefault();
          const trigger = timeline.scrollTrigger;
          const beat = Number(link.dataset.beat);
          window.scrollTo({
            top: trigger.start + (trigger.end - trigger.start) * beat,
            behavior: "instant",
          });
          history.replaceState(null, "", link.getAttribute("href"));
          const target = document.querySelector(link.getAttribute("href"));
          if (target) {
            target.inert = false;
            target.focus({ preventScroll: true });
          }
        };
        document.addEventListener("click", navigate);
        // Direct hash loads use the same entry positions as navigation.
        const hashLink = Array.from(
          document.querySelectorAll("a[data-beat]"),
        ).find((link) => link.hash === window.location.hash);
        if (hashLink && window.location.hash)
          requestAnimationFrame(() => hashLink.click());
        return () => {
          document.removeEventListener("click", navigate);
          element.classList.remove("is-choreographed");
          element.style.removeProperty("--progress");
          scenes.forEach((scene) => {
            scene.inert = false;
          });
        };
      },
      root,
    );
    return () => media.revert();
  }, [root]);
}
