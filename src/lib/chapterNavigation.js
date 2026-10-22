let pendingFocus;

// Interests shares Home's pinned stage, so navigate to the camera's endpoint.
export function scrollToChapter(id, { instant = false } = {}) {
  const section = document.getElementById(id);
  if (!section) return;
  const opening = document.querySelector(".opening-experience");
  const top =
    id === "home"
      ? 0
      : id === "interests" && opening?.dataset.scrollEnd
        ? Number(opening.dataset.scrollEnd)
        : id === "projects" && section.dataset.scrollReady
          ? Number(section.dataset.scrollReady)
          : section.getBoundingClientRect().top + window.scrollY;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (pendingFocus) window.removeEventListener("scrollend", pendingFocus);
  const focus = () => {
    window.removeEventListener("scrollend", focus);
    if (!section.inert) section.focus({ preventScroll: true });
    if (pendingFocus === focus) pendingFocus = undefined;
  };
  pendingFocus = focus;
  const alreadyThere = Math.abs(window.scrollY - top) < 1;
  if (!instant && !reduced && !alreadyThere)
    window.addEventListener("scrollend", focus, { once: true });
  window.scrollTo({ top, behavior: instant || reduced ? "instant" : "smooth" });
  if (instant || reduced || alreadyThere) requestAnimationFrame(focus);
  history.replaceState(null, "", `#${id}`);
}
