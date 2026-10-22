import SiteImage from "../components/SiteImage";
import { useEffect, useRef, useState } from "react";
import { gallerySizes, prepareImage } from "../lib/siteImages";
import { interests } from "../data/editorial";
import CharacterDoodle from "../components/CharacterDoodle";
import "../styles/interests-collage.css";

const prepare = prepareImage;
const frameImages = (theme) =>
  interests.map((interest, index) =>
    theme ? theme.images[index] : interest.image,
  );

export default function InterestsSection() {
  const [pinned, setPinned] = useState(null);
  const [preview, setPreview] = useState(null);
  const [automatic, setAutomatic] = useState(null);
  const [paused, setPaused] = useState(false);
  const [engaged, setEngaged] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [scene, setScene] = useState({
    current: null,
    previous: null,
    revision: 0,
    wave: [],
  });
  const gallery = useRef(null);
  const selected = preview || pinned || automatic;
  const cycling =
    !paused && !engaged && !focused && !pinned && visible && !reduced;
  const theme = interests.find((interest) => interest.id === selected) || null;
  const previous =
    interests.find((interest) => interest.id === scene.previous) || null;
  const current =
    interests.find((interest) => interest.id === scene.current) || null;

  useEffect(() => {
    let cancelled = false;
    Promise.all(frameImages(theme).map((url) => prepare(url))).then(
      (results) => {
        if (cancelled || !results.every(Boolean)) return;
        const frames = [...gallery.current.querySelectorAll(".collage-frame")];
        const originIndex = Math.max(
          0,
          interests.findIndex((interest) => interest.id === selected),
        );
        const rects = frames.map((frame) => frame.getBoundingClientRect());
        const origin = rects[originIndex];
        const x = origin.left + origin.width / 2;
        const y = origin.top + origin.height / 2;
        const distances = rects.map((rect) =>
          Math.hypot(
            rect.left + rect.width / 2 - x,
            rect.top + rect.height / 2 - y,
          ),
        );
        const max = Math.max(...distances, 1);
        const wave = rects.map((rect, index) => ({
          delay: reduced ? 0 : Math.round((distances[index] / max) * 420),
          x: Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100)),
          y: Math.max(0, Math.min(100, ((y - rect.top) / rect.height) * 100)),
        }));
        setScene((last) =>
          last.current === selected
            ? last
            : {
                current: selected,
                previous: last.current,
                revision: last.revision + 1,
                wave,
              },
        );
      },
    );
    return () => {
      cancelled = true;
    };
  }, [selected, theme, reduced]);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduced(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    const updateVisibility = () => {
      if (!gallery.current) return;
      const section = gallery.current.closest("section");
      const rect = section.getBoundingClientRect();
      const opening = document.querySelector(".opening-experience");
      const arrived =
        !opening?.dataset.scrollEnd || +opening.dataset.motionProgress >= 0.98;
      const uncovered =
        document.querySelector("#projects").getBoundingClientRect().top >=
        innerHeight * 0.85;
      setVisible(
        !document.hidden &&
          arrived &&
          uncovered &&
          rect.bottom > innerHeight * 0.5 &&
          rect.top < innerHeight * 0.5,
      );
    };
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("portfolio:motion", updateVisibility);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      preference.removeEventListener("change", updatePreference);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("portfolio:motion", updateVisibility);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!cycling) return;
    const timer = setTimeout(() => {
      setAutomatic(
        (last) =>
          interests[
            (interests.findIndex((interest) => interest.id === last) + 1) %
              interests.length
          ].id,
      );
    }, 6000);
    return () => clearTimeout(timer);
  }, [cycling, automatic]);

  useEffect(() => {
    if (!visible || navigator.connection?.saveData) return;
    const next =
      interests[
        (interests.findIndex((interest) => interest.id === automatic) + 1) %
          interests.length
      ];
    const timer = setTimeout(
      () => next.images.forEach((url) => prepare(url)),
      1200,
    );
    return () => clearTimeout(timer);
  }, [visible, automatic]);

  return (
    <section
      id="interests"
      tabIndex="-1"
      className="portfolio-section editorial-interests"
      data-theme={scene.current || "all"}
      data-cycling={cycling}
      onFocusCapture={(event) =>
        setFocused(event.target.matches(":focus-visible"))
      }
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="section-heading">
        <div>
          <span className="section-index">02 / INTERESTS</span>
          <h2>Pieces of my world.</h2>
        </div>
      </div>
      <div className="interests-composition">
        <div
          className="archive-grid editorial-collage"
          ref={gallery}
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") setEngaged(true);
          }}
          onPointerLeave={() => {
            setPreview(null);
            setEngaged(false);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setPreview(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setPinned(null);
              setPreview(null);
              setAutomatic(null);
              setPaused(true);
            }
          }}
        >
          {[
            "vertical-a",
            "vertical-b",
            "vertical-c",
            "vertical-d",
            "horizontal-a",
            "horizontal-b",
            "horizontal-c",
          ].map((rule) => (
            <span
              key={rule}
              className={`wall-rule ${rule}`}
              aria-hidden="true"
            />
          ))}
          {interests.map((interest, index) => (
            <button
              key={interest.id}
              className={`archive-tile collage-frame frame-${index + 1}`}
              aria-label={`Explore ${interest.label}`}
              aria-pressed={selected === interest.id}
              aria-describedby="interest-story"
              style={{
                "--wave-delay": `${scene.wave[index]?.delay || 0}ms`,
                "--wave-x": `${scene.wave[index]?.x ?? 50}%`,
                "--wave-y": `${scene.wave[index]?.y ?? 50}%`,
              }}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setPreview(interest.id);
              }}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible"))
                  setPreview(interest.id);
              }}
              onClick={() => {
                setPinned((last) =>
                  last === interest.id ? null : interest.id,
                );
                setPreview(null);
              }}
            >
              <span className="frame-image">
                <SiteImage
                  key={`previous-${scene.revision}-${index}`}
                  className="gallery-photo gallery-photo-previous"
                  src={frameImages(previous)[index]}
                  alt=""
                  width="900"
                  height="900"
                  sizes={gallerySizes}
                  fetchPriority="low"
                  style={{
                    objectPosition: previous?.position || interest.position,
                  }}
                />
                <SiteImage
                  key={`${scene.revision}-${index}`}
                  className="gallery-photo gallery-photo-current"
                  src={frameImages(current)[index]}
                  alt={
                    current
                      ? `${current.label} — visual study ${index + 1}`
                      : interest.label
                  }
                  width="900"
                  height="900"
                  sizes={gallerySizes}
                  fetchPriority="low"
                  style={{
                    objectPosition: current?.position || interest.position,
                  }}
                />
              </span>
              <span className="archive-caption">
                <span>0{index + 1}</span>
                <strong>{interest.shortLabel || interest.label}</strong>
              </span>
            </button>
          ))}
        </div>
        <CharacterDoodle
          character="headphones"
          className="wall-listener"
          loading="eager"
        />
      </div>
      <p
        className="gallery-announcement"
        id="interest-story"
        aria-live={preview || pinned ? "polite" : "off"}
        aria-atomic="true"
      >
        {theme
          ? theme.label + ". " + theme.description
          : "Seven interests. Choose a photo to explore a theme across the wall."}
      </p>
      <div className="gallery-theme-note" aria-live="off">
        <span>
          {current?.shortLabel || current?.label || "SEVEN LITTLE OBSESSIONS"}
        </span>
        <p key={scene.current || "all"}>
          {current?.note || "Hover a photo. Follow the ripple."}
        </p>
      </div>
      <div className="section-baseline">
        <span>Hover, focus or tap to explore.</span>
        <div className="gallery-controls">
          <button
            className="gallery-playback"
            aria-pressed={paused || reduced}
            disabled={reduced}
            onClick={() => {
              setPaused((last) => !last);
              setPinned(null);
              setPreview(null);
            }}
          >
            {reduced
              ? "Automatic motion off"
              : paused
                ? "Play collection ▷"
                : "Pause collection Ⅱ"}
          </button>
          <button
            className="reset-gallery"
            onClick={() => {
              setPinned(null);
              setPreview(null);
              setAutomatic(null);
              setPaused(true);
            }}
          >
            Show all interests <span aria-hidden="true">↺</span>
          </button>
        </div>
      </div>
    </section>
  );
}
