import { useState } from "react";
import { interests } from "../data/portfolio";
import gallery from "../assets/gallery/gallery-reference.webp";
export default function Interests() {
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);
  const active = preview ?? selected;
  const current = interests.find((i) => i.id === active);
  const displayed = current ?? interests[0];
  const selectInterest = (id) => {
    setSelected(id);
    setPreview(null);
  };
  return (
    <section
      id="about"
      tabIndex="-1"
      className="story-scene gallery-scene room-wall"
    >
      <div className="gallery-room" data-themed={Boolean(current)}>
        <img
          className="gallery-photo"
          src={gallery}
          width="2214"
          height="1246"
          alt="A girl in a hoodie, seen from behind, studying a carefully arranged wall of framed paintings."
          loading="lazy"
        />
        <div className="gallery-heading">
          <span className="eyebrow">01 / Inside my world</span>
          <h2>
            Curiosity,
            <br />
            <em>on the wall.</em>
          </h2>
          <p>
            A different view of the same room.
            <br />
            Choose an interest to reframe it.
          </p>
          <div
            className="interest-switcher"
            aria-label="Choose a gallery theme"
          >
            {interests.map((interest) => (
              <button
                key={interest.id}
                aria-label={`Select ${interest.label}`}
                aria-pressed={selected === interest.id}
                onFocus={() => setPreview(interest.id)}
                onBlur={() => setPreview(null)}
                onPointerEnter={(e) => {
                  if (e.pointerType !== "touch") setPreview(interest.id);
                }}
                onPointerLeave={() => setPreview(null)}
                onClick={() => selectInterest(interest.id)}
              >
                {interest.label}
                <span aria-hidden="true">
                  {selected === interest.id ? "✓" : "↗"}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div
          className="gallery-wall"
          onPointerLeave={() => setPreview(null)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPreview(null);
          }}
        >
          {interests.map((interest, index) => (
            <button
              key={interest.id}
              className={`wall-frame wall-frame-${index} ${active === interest.id ? "is-active" : ""}`}
              aria-label={`Explore ${interest.label}`}
              aria-pressed={selected === interest.id}
              onPointerEnter={(e) => {
                if (e.pointerType !== "touch") setPreview(interest.id);
              }}
              onFocus={() => setPreview(interest.id)}
              onClick={() => selectInterest(interest.id)}
            >
              <span className="frame-art">
                <img
                  key={displayed.id}
                  className="interest-photo"
                  src={displayed.scenes[index].image}
                  alt={displayed.scenes[index].alt}
                  data-theme={displayed.id}
                  width="540"
                  height="540"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                />
              </span>
              <span className="frame-label">
                <span>0{index + 1}</span>
                {interest.label}
                <span>{selected === interest.id ? "✓" : "↗"}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="gallery-caption">
          <div aria-live="polite">
            <span className="eyebrow">
              {current ? current.label : "A collection of possibilities"}
            </span>
            <p>{current ? current.description : "Look a little closer."}</p>
          </div>
          <button
            className="text-button"
            onClick={() => {
              setSelected(null);
              setPreview(null);
            }}
          >
            Reset wall ↺
          </button>
          <span className="draft-note">
            Proposed interests · awaiting confirmation
          </span>
        </div>
      </div>
    </section>
  );
}

