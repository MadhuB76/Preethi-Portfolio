import { projects } from "../data/portfolio";
export default function Projects() {
  return (
    <>
      {projects.map((project, index) => (
        <section
          key={project.number}
          id={index === 0 ? "projects" : `project-${project.number}`}
          tabIndex="-1"
          className={`story-scene project-scene project-scene-${index}`}
        >
          <div className="project-grid" aria-hidden="true" />
          <div className="project-number" aria-hidden="true">
            {project.number}
          </div>
          <div className="image-plane">
            <div
              className={`architectural-study study-${index}`}
              role="img"
              aria-label={`Temporary architectural line study for project ${project.number}; no project screenshot supplied`}
            >
              <svg
                viewBox="0 0 800 700"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <rect
                  width="800"
                  height="700"
                  fill={index === 1 ? "#252522" : "#ded9ce"}
                />
                <path
                  d={
                    index === 0
                      ? "M0 700 380 250 800 0v700Z"
                      : index === 1
                        ? "M0 0h510L290 700H0Z"
                        : "M0 700V0h800L360 420Z"
                  }
                  fill={index === 1 ? "#d3cdbc" : "#3a3a34"}
                />
                <g stroke={index === 1 ? "#171615" : "#f4f0e7"} strokeWidth="3">
                  {Array.from({ length: 9 }, (_, i) => (
                    <path
                      key={i}
                      d={`M${i * 115 - 200} 0 ${i * 115 + 130} 700`}
                      opacity=".5"
                    />
                  ))}
                </g>
                <path
                  d="M0 520 800 200M180 0v700M620 0 300 700"
                  stroke="#171615"
                  strokeWidth="8"
                />
                <path d="M0 526 800 206" stroke="#f4f0e7" strokeWidth="2" />
              </svg>
              <div className="asset-label">
                VISUAL STUDY / TEMPORARY ARTWORK
                <br />
                REAL PROJECT IMAGERY TO FOLLOW
              </div>
            </div>
          </div>
          <div className="project-content">
            <span className="eyebrow">
              02 / Selected work / {project.number}
            </span>
            <h2>{project.title}</h2>
            <p className="project-category">{project.category}</p>
            <p>{project.summary}</p>
            <span className="pending">Project content forthcoming</span>
            {project.href && (
              <a className="text-button" href={project.href}>
                View project ↗
              </a>
            )}
          </div>
          <div className="project-rail">
            <a href="#about" data-beat=".23">
              ← Back to the gallery
            </a>
            <span>{project.number} / 03</span>
            <a
              href={index === 2 ? "#contact" : `#project-0${index + 2}`}
              data-beat={index === 2 ? 1 : index === 0 ? 0.61 : 0.78}
            >
              {index === 2 ? "Continue to contact" : "Next project"} →
            </a>
          </div>
        </section>
      ))}
    </>
  );
}
