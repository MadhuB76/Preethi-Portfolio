import SiteImage from "../components/SiteImage";
import Doodle from "../components/BrushDoodle";
import "../styles/hero-brush.css";
export default function HeroSection({ onOpen, triggerRef, open }) {
  return (
    <section
      id="home"
      tabIndex="-1"
      className="portfolio-section editorial-hero"
    >
      <img
        className="hero-paint hero-paint-top"
        src="/images/hero-watercolor.svg"
        alt=""
        aria-hidden="true"
      />
      <img
        className="hero-paint hero-paint-bottom"
        src="/images/hero-watercolor.svg"
        alt=""
        aria-hidden="true"
      />
      <button
        ref={triggerRef}
        className="open-navigation"
        onClick={onOpen}
        aria-label="Open navigation"
        aria-controls="portfolio-navigation"
        aria-expanded={open}
      >
        Open
      </button>
      <div className="top-meta">
        <span>PREETHI / DEVELOPER</span>
        <span>PERSONAL PORTFOLIO — {new Date().getFullYear()}</span>
      </div>
      <div className="portfolio-title">
        <h1>
          Portfolio<span className="title-period">.</span>
        </h1>
        <Doodle kind="spark" className="title-spark" />
        <Doodle kind="flower" className="title-flower" />
        <Doodle kind="sprig" className="title-sprig" />
        <Doodle kind="smile" className="title-smile" />
        <Doodle kind="tick" className="title-tick" />
        <Doodle kind="flower" className="title-small-flower" />
        <Doodle kind="sprig" className="title-little-sprig" />
        <span className="hand-note title-note">ideas, brought to life</span>
      </div>
      <div className="hero-introduction">
        <div className="portrait-composition">
          <div className="portrait-ring">
            <svg
              className="portrait-brush-ring"
              viewBox="0 0 280 280"
              aria-hidden="true"
              fill="none"
            >
              <path
                d="M144 7C216 2 276 64 272 142C270 218 213 273 137 271C66 274 4 215 8 136C8 64 66 3 144 7Z"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M119 9C49 19 1 79 5 148C9 224 73 278 148 275C220 272 277 211 275 136C273 70 226 16 166 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="portrait-photo-window">
              <SiteImage
                className="portrait-photo"
                src="/images/profile/preethi.webp"
                alt="Preethi sitting on a garden bench under a tree"
                width="941"
                height="1672"
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 560px) 400px, 460px"
                decoding="async"
              />
            </div>
          </div>
          <span className="portrait-caption">PREETHI</span>
          <Doodle kind="smile" className="portrait-smile" />
          <Doodle kind="spark" className="portrait-spark" />
        </div>
        <div className="hero-intro-copy">
          <span className="tiny-hello hand-note">Hi!</span>
          <Doodle kind="star" className="intro-star" />
          <p className="hero-lead">
            My name is <strong>Preethi.</strong> I’m a developer who loves
            turning ideas into meaningful digital experiences.
          </p>
          <p>
            I enjoy building for the web, combining clean code, thoughtful
            design, and good UX to create experiences that feel simple and
            intuitive.
          </p>
          <p className="hero-objective">
            My objective is to keep learning, challenge myself with new ideas,
            and build digital products that solve real problems. I’m always
            looking for new ways to grow as a developer, explore different
            perspectives, and turn imagination into something real.
          </p>
          <div className="hero-copy-ending">
            <a href="#projects" className="editorial-link">
              Explore my work <span>↗</span>
            </a>
            <div className="intro-annotations">
              <span className="hand-note">
                built with
                <br />
                curiosity
              </span>
              <Doodle kind="tick" />
              <Doodle kind="flower" />
            </div>
          </div>
        </div>
      </div>
      <div className="hero-baseline">
        <span>A developer’s collection of ideas & experiments.</span>
        <a href="#interests">Scroll to explore ↓</a>
      </div>
    </section>
  );
}
