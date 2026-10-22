import { useEffect, useRef, useState } from "react";
import { skillCategories } from "../data/editorial";
import SkillsParticles from "../components/SkillsParticles";
import "../styles/skills-orbits.css";

const shades = ["#494949", "#a0a0a0", "#777777", "#c2c2c2", "#616161"];
const pairs = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 4],
  [2, 3],
];
function ringPath(radius, phase) {
  return (
    Array.from({ length: 120 }, (_, i) => {
      const angle = (i / 120) * Math.PI * 2;
      const r =
        radius *
        (1 +
          Math.sin(angle * 5 + phase) * 0.035 +
          Math.cos(angle * 9 + phase) * 0.018);
      return `${i ? "L" : "M"}${(75 + Math.cos(angle) * r).toFixed(2)},${(75 + Math.sin(angle) * r).toFixed(2)}`;
    }).join(" ") + "Z"
  );
}
export default function AboutSection() {
  const network = useRef(null);
  const [geometry, setGeometry] = useState({
    width: 1200,
    height: 960,
    nodes: [],
  });
  useEffect(() => {
    const surface = network.current;
    const measure = () => {
      const bounds = surface.getBoundingClientRect();
      setGeometry({
        width: bounds.width,
        height: bounds.height,
        nodes: [...surface.querySelectorAll(".network-category")].map(
          (node) => {
            const rect = node.getBoundingClientRect();
            return {
              x: rect.left - bounds.left + rect.width / 2,
              y: rect.top - bounds.top + rect.height / 2,
            };
          },
        ),
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(surface);
    surface
      .querySelectorAll(".network-group")
      .forEach((group) => observer.observe(group));
    measure();
    return () => observer.disconnect();
  }, []);
  const routes = geometry.nodes.length
    ? pairs.map(([from, to]) => {
        const a = geometry.nodes[from],
          b = geometry.nodes[to];
        const bend = geometry.width < 600 ? 36 : 85;
        return `M${a.x} ${a.y} C${a.x - bend} ${a.y + 120},${b.x - bend} ${b.y - 100},${b.x} ${b.y}`;
      })
    : [];
  const [active, setActive] = useState(null);
  const [selected, setSelected] = useState(null);
  const choose = (index) => setActive(index);
  return (
    <section
      id="about"
      tabIndex="-1"
      className="portfolio-section editorial-about neural-skills"
      aria-labelledby="skills-title"
      data-category={active === null ? "all" : skillCategories[active].id}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setActive(null);
          setSelected(null);
        }
      }}
    >
      <SkillsParticles />
      <header className="network-heading">
        <h2 id="skills-title">04 / THE WAY I BUILD</h2>
        <p>Everything connects.</p>
      </header>
      <div className="skills-network" ref={network}>
        <svg
          className="network-art"
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <g className="network-web">
            {routes.map((route, i) => (
              <path
                key={route}
                d={route}
                className={`network-route ${active !== null && (i === active || i === active + 1) ? "is-active" : ""}`}
              />
            ))}
            {pairs.map(([from, to], i) =>
              geometry.nodes.length ? (
                <circle
                  key={i}
                  cx={
                    (geometry.nodes[from].x + geometry.nodes[to].x) / 2 -
                    (geometry.width < 600 ? 27 : 63.75)
                  }
                  cy={(geometry.nodes[from].y + geometry.nodes[to].y) / 2 + 7.5}
                  r="2.5"
                />
              ) : null,
            )}
          </g>
        </svg>
        {skillCategories.map((category, index) => (
          <div
            key={category.id}
            className={`network-group group-${index} ${active === index ? "is-active" : ""}`}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") choose(index);
            }}
          >
            <button
              className="network-category"
              aria-label={`Explore ${category.label}`}
              aria-pressed={active === index}
              onClick={() => choose(index)}
              onFocus={() => choose(index)}
              style={{ "--node-tone": shades[index] }}
            >
              <svg
                className="network-hub"
                viewBox="0 0 150 150"
                aria-hidden="true"
              >
                {[64, 57, 48, 37, 25, 12].map((radius, layer) => (
                  <path
                    key={radius}
                    className={`hub-ring ring-layer-${layer}`}
                    d={ringPath(radius, index + layer * 0.7)}
                  />
                ))}
              </svg>
              <span className="network-number">0{index + 1}</span>
            </button>
            <div className="network-copy">
              <h3>{category.label}</h3>
              <ul
                className="network-skills"
                aria-label={`${category.label} skills`}
              >
                {category.skills.map((skill) => (
                  <li key={skill}>
                    <button
                      className="network-skill"
                      aria-label={`Select ${skill}`}
                      aria-pressed={selected === skill}
                      onFocus={() => choose(index)}
                      onClick={() => {
                        choose(index);
                        setSelected((last) => (last === skill ? null : skill));
                      }}
                    >
                      <span aria-hidden="true" className="network-node-dot" />
                      {skill}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <p className="network-status" aria-live="polite">
        {selected || "A few tools. Endless connections."}
      </p>
    </section>
  );
}
