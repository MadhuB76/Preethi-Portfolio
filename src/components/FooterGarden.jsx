// Original, lightweight vector garden inspired by the supplied footer reference.
export default function FooterGarden() {
  const flowers = [
    { x: 30, y: 80, r: 11, color: "#e6a5b2" },
    { x: 76, y: 45, r: 17, color: "#a2d2df" },
    { x: 120, y: 77, r: 15, color: "#7eadd0" },
    { x: 164, y: 34, r: 14, color: "#f0c54b" },
    { x: 206, y: 62, r: 18, color: "#9dbbd7" },
    { x: 250, y: 80, r: 12, color: "#dba0ad" },
  ];
  return (
    <svg
      className="footer-garden"
      viewBox="0 0 290 170"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="#497160" strokeWidth="2" strokeLinecap="round">
        {flowers.map(({ x, y }) => (
          <path key={x} d={`M${x} ${y} Q${x - 10} 135 ${x + 8} 161`} />
        ))}
      </g>
      <g fill="#588778">
        {flowers.map(({ x }, i) => (
          <g key={x}>
            <ellipse
              cx={x - 7}
              cy={124 + (i % 3) * 8}
              rx="7"
              ry="19"
              transform={`rotate(-38 ${x - 7} ${124 + (i % 3) * 8})`}
            />
            <ellipse
              cx={x + 12}
              cy={138 - (i % 2) * 10}
              rx="6"
              ry="17"
              transform={`rotate(37 ${x + 12} ${138 - (i % 2) * 10})`}
            />
          </g>
        ))}
      </g>
      {flowers.map(({ x, y, r, color }) => (
        <g key={x} fill={color}>
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <ellipse
              key={angle}
              cx={x}
              cy={y - r * 0.7}
              rx={r * 0.48}
              ry={r * 0.8}
              transform={`rotate(${angle} ${x} ${y})`}
            />
          ))}
          <circle cx={x} cy={y} r={r * 0.3} fill="#365666" />
        </g>
      ))}
      <path
        d="M10 163q135 5 272-1"
        stroke="#497160"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
