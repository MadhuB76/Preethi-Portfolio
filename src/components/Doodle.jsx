const paths = {
  flower:
    "M49 43C8 0 14 72 44 51C-1 93 72 100 51 57C94 99 108 23 58 43C95-2 20-10 49 43ZM49 43Q64 30 60 49Q53 64 44 51Q38 40 49 43Z",
  star: "M50 4 54 37 85 16 65 44 98 50 65 55 83 86 55 65 50 98 44 65 15 86 36 55 3 50 36 44 16 16 44 36Z",
  tick: "M15 52Q29 62 37 81Q55 36 88 16",
  arrow: "M6 65Q25 15 76 33M56 10l24 24-27 21",
  smile:
    "M87 49C92 100 8 103 10 51C8 1 91 0 87 49ZM32 32l-1 10m29-10 1 10M29 58Q48 82 69 56",
  spark: "M50 13v74M13 50h74M22 23l56 54M24 77l53-53",
  sprig:
    "M50 94Q48 53 59 6M50 66Q5 66 26 35Q44 38 50 66M51 45Q96 49 83 17Q62 17 51 45",
};
export default function Doodle({ kind = "flower", className = "" }) {
  return (
    <svg
      className={`doodle ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path pathLength="1" d={paths[kind] ?? paths.flower} />
    </svg>
  );
}
