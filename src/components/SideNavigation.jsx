import { useEffect, useRef } from "react";
import { chapters } from "../data/editorial";
import { scrollToChapter } from "../lib/chapterNavigation";
export default function SideNavigation({ open, onClose, active, triggerRef }) {
  const panel = useRef(null);
  const close = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const returnTarget = previous?.matches("button")
      ? previous
      : triggerRef.current;
    const bodyOverflow = document.body.style.overflow;
    const background = document.querySelector(".portfolio-canvas");
    background.inert = true;
    document.body.style.overflow = "hidden";
    close.current.focus();
    return () => {
      background.inert = false;
      document.body.style.overflow = bodyOverflow;
      returnTarget?.focus({ preventScroll: true });
    };
  }, [open, triggerRef]);
  const handleKeys = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
    if (e.key === "Tab") {
      const controls = [...panel.current.querySelectorAll("button,a")];
      const first = controls[0],
        last = controls.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  return (
    <>
      <div
        className={`drawer-scrim ${open ? "visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="portfolio-navigation"
        ref={panel}
        className={`side-navigation ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nav-title"
        aria-hidden={!open}
        inert={!open}
        onKeyDown={handleKeys}
      >
        <div className="drawer-top">
          <span id="nav-title">PREETHI</span>
          <button
            ref={close}
            className="close-navigation"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path
                d="M10 8Q18 13 26 23L39 36 37 40Q26 31 21 26L8 13ZM37 7 41 10Q31 24 12 40L7 37Q22 20 37 7Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <svg
          className="navigation-curve"
          viewBox="0 0 260 620"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M-120-20Q370 295-120 650" />
        </svg>
        <nav aria-label="Portfolio chapters">
          {chapters.map((chapter) => (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              className={active === chapter.id ? "active" : ""}
              aria-current={active === chapter.id ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                onClose();
                requestAnimationFrame(() => {
                  scrollToChapter(chapter.id);
                });
              }}
            >
              <span className="chapter-number">{chapter.number}</span>
              <span className="chapter-description">
                <strong>{chapter.label}</strong>
                <span>{chapter.description}</span>
              </span>
            </a>
          ))}
        </nav>
        <p className="drawer-credit">
          <strong>Preethi</strong>
          <span>Made with care.</span>
          <span>© {new Date().getFullYear()}</span>
        </p>
      </aside>
    </>
  );
}
