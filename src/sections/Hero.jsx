import { CodeXml, ArrowRight, ArrowUpRight } from "lucide-react";
import { site } from "../data/portfolio";
import room from "../assets/hero/room-with-shadows.webp";
export default function Hero() {
  return (
    <section id="home" tabIndex="-1" className="story-scene hero-scene">
      <div className="hero-frame">
        <img
          className="hero-room-image"
          src={room}
          alt="An architectural room with a tall city window and two figures casting long shadows."
          width="2560"
          height="1664"
          fetchPriority="high"
        />
        <a className="hero-brand" href="#home" data-beat="0">
          <span aria-hidden="true" />
          PREETHI<span className="sr-only"> / Developer, home</span>
        </a>
        <div className="hero-copy">
          <span className="hero-medallion" aria-hidden="true">
            <CodeXml strokeWidth={1.6} />
          </span>
          <h1>
            Ideas into
            <br />
            digital experiences.
          </h1>
          <span className="hero-short-rule" aria-hidden="true" />
          <p className="hero-quote">A little logic. A little imagination.</p>
          <p className="hero-introduction">
            I’m Preethi, a developer turning ideas into meaningful digital
            experiences with clean code, thoughtful design, and good UX.
          </p>
          <div className="hero-links">
            <a href="#projects" data-beat=".44">
              <span className="round-arrow">
                <ArrowRight />
              </span>
              View my work
            </a>
            <a href="#about" data-beat=".23">
              About me <ArrowUpRight />
            </a>
          </div>
        </div>
        <div id="skills" className="hero-toolset" tabIndex="-1">
          <h2>Tools of the trade</h2>
          <div className="hero-technologies">
            {site.technologies.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
        </div>
        <p className="hero-wall-note">
          Clean code.
          <br />
          Considered details.
          <br />A curious mind.
        </p>
        <a href="#about" data-beat=".23" className="hero-scroll">
          <span className="scroll-orbit" aria-hidden="true">
            <i />
          </span>
          <span>
            Turn the wall <ArrowRight aria-hidden="true" />
          </span>
        </a>
      </div>
    </section>
  );
}

