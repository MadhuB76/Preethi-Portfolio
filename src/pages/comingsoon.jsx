import { useState, useEffect } from "react";
import ProgressBar from "../components/progressbar";

export default function ComingSoon() {
  const targetProgress = 100;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(targetProgress);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[#FAF7F5] font-sans text-slate-700 select-none">
      {/* ---------- Background Blobs ---------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left Blob */}
        <div
          className="
            absolute
            left-[-120px]
            top-[10%]
            h-[280px]
            w-[280px]
            rounded-full
            bg-gradient-to-tr
            from-amber-200
            via-orange-300
            to-amber-100
            opacity-60
            blur-3xl
            animate-pulse

            sm:left-[8%]
            sm:h-[420px]
            sm:w-[420px]

            lg:left-[15%]
            lg:top-[15%]
            lg:h-[650px]
            lg:w-[650px]
          "
        />

        {/* Right Blob */}
        <div
          className="
            absolute
            right-[-120px]
            bottom-[5%]
            h-[280px]
            w-[280px]
            rounded-full
            bg-gradient-to-bl
            from-rose-300
            via-pink-300
            to-red-200
            opacity-60
            blur-3xl
            animate-pulse
            [animation-delay:1000ms]

            sm:right-[8%]
            sm:h-[420px]
            sm:w-[420px]

            lg:right-[15%]
            lg:bottom-[10%]
            lg:h-[650px]
            lg:w-[650px]
          "
        />
      </div>

      {/* ---------- Content ---------- */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center px-6 text-center sm:px-10 lg:px-16">
        {/* Heading */}
        <h1 className="mb-8 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-[clamp(3rem,8vw,7.5rem)] font-extrabold uppercase leading-[0.9] tracking-tight text-transparent md:mb-10">
          Coming Soon
        </h1>

        {/* Progress Bar */}
        <div className="mb-8 w-full max-w-[700px] md:mb-10">
          <ProgressBar progress={progress} height="h-5 md:h-6" animated />
        </div>

        {/* Description */}
        <div className="mb-8 max-w-md text-sm leading-relaxed text-slate-600 md:mb-10 md:text-base">
          <p>Crafting an experience worth the wait.</p>
          <p>Stay tuned for something extraordinary.</p>
        </div>

        {/* Brand */}
        <div className="mb-8 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 md:mb-12">
          — Preethi —
        </div>

        {/* Arrow */}
        {/* <button
          aria-label="Scroll Down"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-300/80 bg-white/40 text-slate-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/70 active:scale-95"
        >
          <svg
            className="h-4 w-4 animate-bounce"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button> */}
      </div>
    </div>
  );
}

