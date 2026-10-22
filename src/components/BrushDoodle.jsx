// Original, deliberately uneven pen loops and tapered brush marks.
const brushShapes = {
  arrow: "M9 75Q23 27 72 31L54 14 59 10 91 35 66 63 60 59 77 40Q34 33 15 79Z",
  spark:
    "M44 8Q48 5 51 13L54 40 82 19Q90 16 85 24L62 48 91 54Q96 59 87 60L60 57 77 84Q77 92 71 85L51 64 45 92Q40 98 40 88L43 60 14 74Q7 75 14 69L37 50 10 37Q5 31 14 33L41 43Z",
  tick: "M9 49Q15 43 20 51L34 68Q55 36 87 11L93 10Q64 42 41 86Q37 93 31 85L11 59Z",
  star: "M45 11Q49 5 52 15L58 39 85 35Q95 36 85 42L64 53 72 81Q73 90 65 84L47 65 22 80Q12 84 19 74L34 52 13 35Q7 28 17 31L40 40Z",
};
const penLoops = {
  flower:
    "M49 43C24 9 9 24 22 43Q27 51 43 51C8 57 23 87 42 68L49 56C42 95 76 92 66 68L56 53C88 79 103 46 77 43L58 46C88 18 56 4 52 29ZM49 46q11-8 12 4t-14 6q-7-4 2-10",
  smile:
    "M82 25C108 63 69 102 32 85C-2 71 9 22 37 14Q65 2 82 25M34 33l-2 12M61 32l-1 11M29 60Q45 81 69 57",
  sprig:
    "M48 94Q57 67 49 36L43 13M51 65Q13 65 18 39Q44 35 51 65M51 48Q85 43 80 22Q54 21 51 48",
};
export default function BrushDoodle({ kind = "flower", className = "" }) {
  return (
    <svg
      className={`doodle brush-doodle ${className}`}
      viewBox="0 0 100 100"
      aria-hidden="true"
      fill="none"
    >
      {brushShapes[kind] ? (
        <path d={brushShapes[kind]} fill="currentColor" />
      ) : (
        <>
          <path
            d={penLoops[kind] || penLoops.flower}
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={penLoops[kind] || penLoops.flower}
            transform="translate(1.6 -1)"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity=".65"
          />
        </>
      )}
    </svg>
  );
}
