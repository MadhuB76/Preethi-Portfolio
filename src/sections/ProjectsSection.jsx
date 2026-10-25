import SiteImage from "../components/SiteImage";
import { useEffect, useRef, useState } from "react";
import { projects } from "../data/editorial";
import "../styles/projects-blueprint.css";

function ProjectArtwork({ number, detail = false, alternate = false }) {
  return (
    <svg
      viewBox={detail ? "200 160 370 400" : "0 0 900 700"}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Image placeholder for project ${number}`}
    >
      <rect
        x="-100"
        y="-100"
        width="1100"
        height="900"
        fill={alternate ? "#c6c8be" : "#dedfd8"}
      />
      <g
        stroke="#555a4f"
        fill="none"
        strokeWidth="1.2"
        transform={alternate ? "translate(900 0) scale(-1 1)" : undefined}
      >
        {number === "01" ? (
          <>
            <path d="M150 520V180h600v340zM150 180l150 100v240m450-340L600 280v240M300 280h300M150 520h600" />
            {[250, 350, 450, 550, 650].map((x) => (
              <path key={x} d={`M${x} 180v340`} />
            ))}
          </>
        ) : number === "02" ? (
          <>
            <circle cx="450" cy="350" r="210" />
            <circle cx="450" cy="350" r="140" />
            <path d="M120 350h660M450 70v560M230 130l440 440m0-440L230 570" />
          </>
        ) : (
          <path d="m145 470 300-280 310 280-310 100zM145 470V280l300-110 310 110v190M445 170v400M145 280l300 140 310-140M260 240v270m380-270v270" />
        )}
      </g>
    </svg>
  );
}
function ProjectImage({ project, index, detail = false, eager = false }) {
  const imageIndex = detail && project.images?.[2] ? 2 : index;
  const source = project.images?.[imageIndex] || project.image;
  return (
    <figure
      className={`${detail ? "project-detail-image" : "project-editorial-image"}${project.temporaryImages ? "" : " project-product-image"}`}
    >
      {source ? (
        <SiteImage
          src={source}
          alt={
            project.imageAlts?.[imageIndex] ||
            (project.temporaryImages
              ? `Temporary architectural editorial photograph — ${detail ? "detail" : `view ${index + 1}`}`
              : `${project.title} — ${detail ? "detail" : `view ${index + 1}`}`)
          }
          width="900"
          height="1100"
          loading={eager ? "eager" : "lazy"}
          fetchPriority="low"
          sizes={
            detail
              ? "(max-width: 900px) 26vw, 12vw"
              : "(max-width: 900px) 50vw, 24vw"
          }
        />
      ) : (
        <ProjectArtwork
          number={project.number}
          detail={detail}
          alternate={index === 1}
        />
      )}
      {!source && <figcaption>IMAGE TO BE ADDED</figcaption>}
      {source && project.temporaryImages && (
        <figcaption className="temporary-photo-label">
          TEMPORARY EDITORIAL
        </figcaption>
      )}
    </figure>
  );
}
function ProjectVideo({ project }) {
  const videoRef = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      if (visible && !video.getAttribute("src")) video.src = project.video;
      if (visible && !motion.matches && !document.hidden)
        video.play().catch(() => {});
      else video.pause();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      video.pause();
    };
  }, [project.video, failed]);
  if (failed) return <ProjectImage project={project} index={0} eager />;
  return (
    <figure className="project-editorial-image project-video">
      <video
        ref={videoRef}
        poster={project.images[0]}
        aria-label={`${project.title} original homepage hero video`}
        muted
        loop
        playsInline
        preload="none"
        onError={() => setFailed(true)}
      />
    </figure>
  );
}
export default function ProjectsSection() {
  const section = useRef(null);
  const [active, setActive] = useState(0);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1000px" },
    );
    observer.observe(section.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const update = (event) => setActive(event.detail.index);
    window.addEventListener("portfolio:project", update);
    return () => window.removeEventListener("portfolio:project", update);
  }, []);
  const navigate = (index) => {
    const stops = JSON.parse(section.current.dataset.projectStops || "[]");
    if (stops.length)
      window.scrollTo({ top: stops[index], behavior: "smooth" });
    else
      section.current
        .querySelectorAll(".project-screen")
        .item(index)
        .scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section
      id="projects"
      ref={section}
      tabIndex="-1"
      className="portfolio-section editorial-projects project-showcase"
      aria-label="Selected projects"
    >
      <div className="project-stage">
        <div className="project-panels">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="publication-entry project-screen"
              data-project={index}
              aria-labelledby={`${project.id}-title`}
            >
              <div className="project-marker">
                SELECTED WORK <span>{project.number} / {String(projects.length).padStart(2, "0")}</span>
              </div>
              <ProjectImage project={project} index={0} detail eager={near} />
              <div className="project-explanation">
                <span className="project-kicker">
                  PROJECT / {project.number}
                </span>
                <h2 id={`${project.id}-title`}>{project.title}</h2>
                {project.tags.length > 0 && (
                  <p className="project-technologies">
                    {project.tags.join(" / ")}
                  </p>
                )}
                <p>{project.summary}</p>
                {project.href ? (
                  <a
                    className="editorial-link"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit website ↗
                  </a>
                ) : (
                  <span className="project-content-status">
                    Project details forthcoming.
                  </span>
                )}
              </div>
              <div className="project-media-pair">
                {project.video ? (
                  <ProjectVideo project={project} />
                ) : (
                  <ProjectImage project={project} index={0} eager={near} />
                )}
                <ProjectImage project={project} index={1} eager={near} />
              </div>
              <div
                className="project-cropped-title project-screen-title"
                aria-hidden="true"
              >
                Projects
              </div>
            </article>
          ))}
        </div>
        <div
          className="project-cropped-title project-static-title"
          aria-hidden="true"
        >
          Projects
        </div>
        <div className="project-stage-footer">
          <span className="project-position" aria-live="polite">
            {String(active + 1).padStart(2, "0")} <span>/ {String(projects.length).padStart(2, "0")}</span>
          </span>
          <span className="project-scroll-hint">Scroll to explore →</span>
          <div className="project-pagination">
            <button
              aria-label="Previous project"
              disabled={active === 0}
              onClick={() => navigate(active - 1)}
            >
              ←
            </button>
            <button
              aria-label="Next project"
              disabled={active === projects.length - 1}
              onClick={() => navigate(active + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
