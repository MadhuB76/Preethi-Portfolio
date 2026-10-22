import { useEffect, useRef } from "react";

export default function SkillsParticles() {
  const canvas = useRef(null);
  useEffect(() => {
    const surface = canvas.current;
    const section = surface.closest("section");
    const ctx = surface.getContext("2d");
    if (!ctx) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let width = 0,
      height = 0,
      particles = [],
      frame = 0,
      visible = false,
      previous = 0;
    const random = (n) =>
      ((Math.sin(n * 127.1 + 311.7) * 43758.5453) % 1) + 0.5;
    const draw = (time) => {
      frame = 0;
      const dt = Math.min((time - previous) / 1000 || 0.016, 0.035);
      previous = time;
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        if (!media.matches) {
          const dx = p.x - pointer.x,
            dy = p.y - pointer.y,
            distance = Math.hypot(dx, dy);
          const force = distance < 140 ? (1 - distance / 140) * 390 : 0;
          p.vx +=
            ((p.homeX + Math.sin(time * 0.0003 + p.phase) * 5 - p.x) * 10 +
              (dx / (distance || 1)) * force) *
            dt;
          p.vy +=
            ((p.homeY + Math.cos(time * 0.0002 + p.phase) * 5 - p.y) * 10 +
              (dy / (distance || 1)) * force) *
            dt;
          p.vx *= Math.exp(-5 * dt);
          p.vy *= Math.exp(-5 * dt);
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(25,25,25,.48)";
        ctx.fill();
      }
      if (visible && !document.hidden && !media.matches)
        frame = requestAnimationFrame(draw);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = performance.now();
      if (visible && !document.hidden) draw(previous);
    };
    const resize = () => {
      const rect = surface.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const scale = Math.min(devicePixelRatio || 1, 1.5);
      surface.width = Math.round(width * scale);
      surface.height = Math.round(height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      particles = Array.from(
        { length: Math.min(82, Math.round((width * height) / 14500)) },
        (_, i) => {
          const x = Math.abs(random(i + 1) % 1) * width,
            y = Math.abs(random(i + 81) % 1) * height;
          return {
            x,
            y,
            homeX: x,
            homeY: y,
            vx: 0,
            vy: 0,
            radius: 1.6 + (i % 4) * 0.35,
            phase: i,
          };
        },
      );
      restart();
    };
    const move = (e) => {
      if (e.pointerType !== "mouse") return;
      const rect = surface.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const leave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      restart();
    });
    observer.observe(section);
    const sizing = new ResizeObserver(resize);
    sizing.observe(surface);
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", leave);
    media.addEventListener("change", restart);
    document.addEventListener("visibilitychange", restart);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizing.disconnect();
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      media.removeEventListener("change", restart);
      document.removeEventListener("visibilitychange", restart);
    };
  }, []);
  return (
    <canvas ref={canvas} className="skills-particles" aria-hidden="true" />
  );
}
