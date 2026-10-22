import { useRef, useState } from "react";

import navigationBackground from "../assets/navigation_background.svg";
import profile from "../assets/profile.svg";
import home from "../assets/home.svg";
import projects from "../assets/projects.svg";
import skills from "../assets/skills.svg";
import contact from "../assets/contact.svg";
import twinkle from "../assets/twinkle.svg";
import welcomeCat from "../assets/welcome_cat.svg";

const DEFAULT_NAV_ITEMS = [
  { href: "#home", label: "Home", icon: home },
  { href: "#projects", label: "Projects", icon: projects },
  { href: "#skills", label: "Skill Tree", icon: skills },
  { href: "#contact", label: "Contact", icon: contact },
];

// How far (in px) a mobile drag has to travel before it counts as a
// deliberate swipe rather than a tap.
const SWIPE_COMMIT_THRESHOLD = 60;

export default function Navbar({
  navItems = DEFAULT_NAV_ITEMS,
  name = "Preethi",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dragState = useRef(null); // { startX, active, dragPx }
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const toggleOpen = () => setIsOpen((v) => !v);

  // ---- Mobile pointer / swipe handling ----
  const onPointerDown = (e) => {
    // Only meaningful on mobile track; harmless no-op on desktop since
    // the track isn't rendered/interactive there.
    dragState.current = { startX: e.clientX, active: true };
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const state = dragState.current;
    if (!state || !state.active) return;
    const delta = e.clientX - state.startX;
    // Constrain drag: from closed, only allow leftward drag (opening);
    // from open, only allow rightward drag (closing).
    const bounded = isOpen
      ? Math.min(Math.max(delta, 0), 320)
      : Math.min(Math.max(delta, -320), 0);
    setDragPx(bounded);
  };

  const endDrag = () => {
    const state = dragState.current;
    if (!state || !state.active) return;
    dragState.current = null;
    setIsDragging(false);

    if (!isOpen && dragPx <= -SWIPE_COMMIT_THRESHOLD) {
      setIsOpen(true);
    } else if (isOpen && dragPx >= SWIPE_COMMIT_THRESHOLD) {
      setIsOpen(false);
    }
    setDragPx(0);
  };

  // Live translate amount for the sliding track while dragging.
  const dragOffsetPercent = isDragging ? (dragPx / 320) * 100 : 0;

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={`sb-root${isOpen ? " sb-root--open" : ""}`}
      >
        <img
          src={navigationBackground}
          alt=""
          aria-hidden="true"
          className="sb-background"
        />

        {/* ---------- DESKTOP / TABLET LAYOUT ---------- */}
        <div className="sb-desktop">
          <img src={twinkle} alt="" aria-hidden="true" className="sb-twinkle" />

          <img
            src={profile}
            alt={`${name}'s profile photo`}
            className="sb-profile"
          />

          <span className="sb-name">{name}</span>

          <ul className="sb-nav-list">
            {navItems.map((item) => (
              <li key={item.href} className="sb-nav-item">
                <a href={item.href} aria-label={item.label}>
                  <img src={item.icon} alt="" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <img src={welcomeCat} alt="" aria-hidden="true" className="sb-cat" />
        </div>

        {/* ---------- MOBILE LAYOUT ---------- */}
        <div className="sb-mobile">
          <button
            type="button"
            className="sb-hamburger"
            onClick={toggleOpen}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            <span className="sb-hamburger-icon" aria-hidden="true">
              {isOpen ? "\u00D7" : "\u2630"}
            </span>
          </button>

          <div
            className="sb-track"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            style={{
              transform: `translateX(calc(${isOpen ? "-50%" : "0%"} + ${dragOffsetPercent}%))`,
              transition: isDragging ? "none" : "transform 400ms ease",
            }}
          >
            <div className="sb-pane sb-pane--profile">
              <img
                src={twinkle}
                alt=""
                aria-hidden="true"
                className="sb-twinkle"
              />
              <img
                src={profile}
                alt={`${name}'s profile photo`}
                className="sb-profile"
              />
              <span className="sb-name">{name}</span>
              <img
                src={welcomeCat}
                alt=""
                aria-hidden="true"
                className="sb-cat"
              />
            </div>

            <div className="sb-pane sb-pane--nav">
              <ul className="sb-nav-list">
                {navItems.map((item) => (
                  <li key={item.href} className="sb-nav-item">
                    <a
                      href={item.href}
                      aria-label={item.label}
                      onClick={() => setIsOpen(false)}
                    >
                      <img src={item.icon} alt="" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Allura&display=swap");

        .sb-root {
          position: fixed;
          left: 0;
          top: 0;
          width: clamp(220px, 18vw, 280px);
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          z-index: 100;
        }

        .sb-background {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 0;
        }

        .sb-name {
          font-family: "Allura", cursive;
          color: #c81e6b;
          font-size: clamp(1.6rem, 2.4vw, 2.2rem);
          text-align: center;
        }

        .sb-nav-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .sb-nav-item a {
          display: block;
          line-height: 0;
        }

        .sb-nav-item img {
          display: block;
          width: clamp(120px, 12vw, 165px);
          height: auto;
        }

        .sb-nav-item:nth-child(even) {
          align-self: flex-end;
        }

        /* ---------- Desktop / tablet ---------- */
        .sb-desktop {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: clamp(16px, 3vh, 32px) 12px clamp(12px, 2vh, 20px);
        }

        .sb-desktop .sb-twinkle {
          align-self: flex-start;
          width: clamp(18px, 1.8vw, 28px);
          height: auto;
          margin-left: 8%;
        }

        .sb-desktop .sb-profile {
          width: clamp(90px, 9vw, 150px);
          height: auto;
          margin-top: -6px;
        }

        .sb-desktop .sb-name {
          margin-top: 4px;
        }

        .sb-desktop .sb-nav-list {
          width: 100%;
          margin-top: clamp(16px, 3vh, 32px);
          gap: clamp(8px, 1.6vh, 16px);
          padding: 0 4%;
        }

        .sb-desktop .sb-cat {
          margin-top: auto;
          align-self: flex-end;
          width: clamp(70px, 9vw, 120px);
          height: auto;
        }

        .sb-mobile {
          display: none;
        }

        /* ---------- Mobile ---------- */
        @media (max-width: 768px) {
          .sb-desktop {
            display: none;
          }

          .sb-mobile {
            display: block;
            position: relative;
            z-index: 1;
            height: 100%;
          }

          .sb-hamburger {
            position: absolute;
            top: 16px;
            right: 16px;
            z-index: 3;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid #d43b5a;
            background: rgba(255, 255, 255, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            line-height: 1;
            color: #d43b5a;
            cursor: pointer;
            touch-action: manipulation;
          }

          .sb-track {
            display: flex;
            width: 200%;
            height: 100%;
            touch-action: pan-y;
          }

          .sb-pane {
            width: 50%;
            flex: 0 0 50%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 16px;
          }

          .sb-pane--profile .sb-twinkle {
            align-self: flex-start;
            width: 26px;
            height: auto;
            margin-left: 6%;
          }

          .sb-pane--profile .sb-profile {
            width: clamp(96px, 30vw, 140px);
            height: auto;
            margin-top: -4px;
          }

          .sb-pane--profile .sb-cat {
            margin-top: auto;
            align-self: flex-end;
            width: clamp(70px, 20vw, 110px);
            height: auto;
          }

          .sb-pane--nav {
            justify-content: center;
          }

          .sb-pane--nav .sb-nav-list {
            width: 100%;
            gap: 14px;
            padding: 0 6%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sb-track {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
