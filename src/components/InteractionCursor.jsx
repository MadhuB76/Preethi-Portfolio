import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "../styles/interaction-cursor.css";

const interactive =
  'a[href],button,summary,[role="button"],[role="link"],label[for],input,select,[data-cursor="interactive"]';
const native =
  'textarea,input:not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"]):not([type="range"]),[contenteditable]:not([contenteditable="false"]),[data-native-cursor],iframe';

export default function InteractionCursor() {
  const cursor = useRef(null);
  useEffect(() => {
    const surface = cursor.current;
    const mouse = matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const contrast = matchMedia("(forced-colors: active)");
    let frame = 0,
      x = 0,
      y = 0,
      tracking = false;
    const hide = () => {
      surface.dataset.visible = "false";
      surface.dataset.pressed = "false";
      document.documentElement.classList.remove("has-interaction-cursor");
    };
    const stop = () => {
      tracking = false;
      cancelAnimationFrame(frame);
      frame = 0;
      hide();
    };
    const draw = () => {
      frame = 0;
      if (!tracking || !mouse.matches || contrast.matches || document.hidden)
        return stop();
      const target = document.elementFromPoint(x, y);
      if (
        !target ||
        x >= document.documentElement.clientWidth ||
        target.closest(native)
      )
        return hide();
      const control = target.closest(interactive);
      const enabled =
        control &&
        !control.matches(':disabled,[aria-disabled="true"]') &&
        !control.closest("[inert]");
      surface.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      surface.dataset.interactive = enabled ? "true" : "false";
      surface.dataset.visible = "true";
      document.documentElement.classList.add("has-interaction-cursor");
    };
    const schedule = () => {
      if (tracking && !frame) frame = requestAnimationFrame(draw);
    };
    const move = (event) => {
      if (event.pointerType !== "mouse") return stop();
      x = event.clientX;
      y = event.clientY;
      tracking = true;
      schedule();
    };
    const press = (event) => {
      if (event.pointerType !== "mouse") return stop();
      surface.dataset.pressed = "true";
    };
    const release = () => {
      surface.dataset.pressed = "false";
    };
    const keyboard = (event) => {
      if (event.key === "Tab") stop();
    };
    // Retest a stationary pointer after scrolling or a gallery/drawer changes.
    const changes = new MutationObserver(schedule);
    changes.observe(document.getElementById("root"), {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "disabled", "aria-disabled", "inert", "hidden"],
    });
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerup", release, { passive: true });
    document.addEventListener("pointercancel", stop);
    document.addEventListener("keydown", keyboard);
    document.documentElement.addEventListener("pointerleave", stop);
    document.addEventListener("scroll", schedule, {
      capture: true,
      passive: true,
    });
    document.addEventListener("visibilitychange", stop);
    window.addEventListener("blur", stop);
    window.addEventListener("resize", schedule);
    mouse.addEventListener("change", stop);
    contrast.addEventListener("change", stop);
    return () => {
      stop();
      changes.disconnect();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerup", release);
      document.removeEventListener("pointercancel", stop);
      document.removeEventListener("keydown", keyboard);
      document.documentElement.removeEventListener("pointerleave", stop);
      document.removeEventListener("scroll", schedule, true);
      document.removeEventListener("visibilitychange", stop);
      window.removeEventListener("blur", stop);
      window.removeEventListener("resize", schedule);
      mouse.removeEventListener("change", stop);
      contrast.removeEventListener("change", stop);
    };
  }, []);
  return createPortal(
    <div
      ref={cursor}
      className="interaction-cursor"
      data-visible="false"
      aria-hidden="true"
    >
      <span />
    </div>,
    document.body,
  );
}
