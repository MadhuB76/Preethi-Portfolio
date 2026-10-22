import { site } from "../data/editorial";
import Doodle from "../components/Doodle";
import CharacterDoodle from "../components/CharacterDoodle";
import "../styles/contact-archive.css";

export default function ContactSection() {
  return (
    <section
      id="contact"
      tabIndex="-1"
      className="portfolio-section editorial-contact contact-archive"
      aria-labelledby="contact-title"
    >
      <div className="archive-topline">
        <a
          className="archive-signature"
          href="#home"
          aria-label="Preethi, back to home"
        >
          Preethi
          <Doodle kind="spark" />
        </a>
        <span className="archive-edition">05 / LET’S CONNECT</span>
      </div>
      <div className="archive-information">
        <div className="archive-personality">
          <div className="archive-doodle-scene" aria-hidden="true">
            <CharacterDoodle character="headphones" />
            <Doodle kind="flower" className="archive-flower" />
            <Doodle kind="star" className="archive-star" />
            <Doodle kind="smile" className="archive-smile" />
            <svg
              className="archive-coffee"
              viewBox="0 0 90 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 40q25-6 49 0l-5 43q-20 9-38 0zM65 45q25-3 17 17-4 8-18 6M12 89q31 6 59-1M30 28q-11-10 0-20m18 19q10-10 0-19" />
            </svg>
          </div>
          <p className="archive-disciplines">
            <span>Developer.</span>
            <span>A little logic.</span>
            <span>A little imagination.</span>
          </p>
        </div>
        <p className="archive-handnote">
          Good things start
          <br />
          with a hello.
          <Doodle kind="arrow" />
        </p>
        <div className="archive-directory">
          <nav className="archive-navigation" aria-label="Footer navigation">
            <span className="archive-label">EXPLORE</span>
            <a href="#projects">
              Projects <span>↗</span>
            </a>
            <a href="#interests">
              Interests <span>↗</span>
            </a>
            <a href="#about">
              Skills <span>↗</span>
            </a>
            <a href="#home">
              Back to top <span>↑</span>
            </a>
          </nav>
          <div className="archive-socials">
            <span className="archive-label">ELSEWHERE</span>
            {site.socials.length ? (
              site.socials.map((social) => (
                <a
                  key={social.url}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label} <span>↗</span>
                </a>
              ))
            ) : (
              <>
                <span className="archive-social-name">GitHub</span>
                <span className="archive-social-name">LinkedIn</span>
                <p className="archive-pending">Links coming soon.</p>
              </>
            )}
            {site.email && (
              <a className="archive-email" href={`mailto:${site.email}`}>
                Say hello <span>↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="archive-wordmark">
        <h2 id="contact-title">Preethi</h2>
        <Doodle kind="flower" className="archive-wordmark-mark" />
      </div>
      <footer className="portfolio-footer archive-credits">
        <span>PREETHI / DEVELOPER</span>
        <span>© {new Date().getFullYear()} · Made with care.</span>
      </footer>
    </section>
  );
}
