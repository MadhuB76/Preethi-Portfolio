function Artwork({ theme, v, colour }) {
  const ink = "#514e45",
    paper = "#f1e9d9";
  const record = (x, y, r = 24) => (
    <g>
      <circle cx={x} cy={y} r={r} fill={ink} />
      <circle cx={x} cy={y} r={r / 3} fill={colour} />
    </g>
  );
  const book = (x, y, w = 16, h = 50) => (
    <rect x={x} y={y} width={w} height={h} fill={colour} />
  );
  const leaf = (x, y) => (
    <path
      d={`M${x} ${y}q-40-4-30-38 33 1 30 38m0 0q36-8 30-42-33 7-30 42`}
      fill={colour}
    />
  );
  const screen = (x, y, w, h) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={ink} />
      <path
        d={`m${x + w * 0.3} ${y + h * 0.35}-12 14 12 14m${w * 0.4}-28 12 14-12 14`}
        fill="none"
        stroke={paper}
        strokeWidth="3"
      />
    </g>
  );
  if (theme === "art")
    return [
      <g key="0">
        <rect x="58" y="38" width="88" height="120" fill={paper} />
        <circle cx="103" cy="79" r="26" fill={colour} />
        <path d="m68 147 35-51 34 51" fill="#939780" />
        <rect x="176" y="78" width="70" height="70" fill={colour} />
      </g>,
      <g key="1">
        <rect x="72" y="42" width="162" height="112" fill={paper} />
        <path
          d="M85 143q8-91 52-51t83-30"
          stroke={colour}
          strokeWidth="18"
          fill="none"
        />
        <circle cx="202" cy="65" r="14" fill="#929780" />
      </g>,
      <g key="2">
        <path d="m61 177 35-136h111l33 136M86 78h126" fill="none" />
        <rect x="91" y="49" width="119" height="112" fill={paper} />
        <path d="M108 147V88q32-49 78 0v59Z" fill={colour} />
      </g>,
      <g key="3">
        <rect x="57" y="50" width="80" height="95" fill={paper} />
        <rect x="167" y="50" width="80" height="95" fill={paper} />
        <ellipse cx="97" cy="98" rx="24" ry="36" fill={colour} />
        <path d="m175 135 27-72 36 72Z" fill="#a2a18b" />
      </g>,
      <g key="4">
        <path d="M55 137h200v18H55z" fill={paper} />
        <path d="M77 136V63h36v73m16 0V45h45v91m16 0V83h38v53" fill={colour} />
        <circle cx="151" cy="77" r="18" fill={paper} />
      </g>,
      <g key="5">
        <rect x="64" y="42" width="180" height="122" fill={paper} />
        <path d="m80 145 33-79 38 64 29-55 47 70" fill={colour} />
        <circle cx="176" cy="66" r="15" fill="#979c86" />
      </g>,
    ][v];
  if (theme === "music")
    return [
      <g key="0">
        <rect x="58" y="58" width="112" height="106" fill={paper} />
        {record(113, 110, 37)}
        <path d="M202 65v76m0-59 37-9v61" fill="none" />
      </g>,
      <g key="1">
        <path
          d="M90 136V92a62 62 0 0 1 124 0v44"
          fill="none"
          stroke={colour}
          strokeWidth="17"
        />
        <rect x="75" y="103" width="27" height="52" rx="8" fill={ink} />
        <rect x="202" y="103" width="27" height="52" rx="8" fill={ink} />
      </g>,
      <g key="2">
        <rect x="64" y="55" width="75" height="118" fill={colour} />
        <rect x="177" y="55" width="75" height="118" fill={colour} />
        {record(101, 129, 24)}
        {record(214, 129, 24)}
        <circle cx="101" cy="82" r="12" fill={ink} />
        <circle cx="214" cy="82" r="12" fill={ink} />
      </g>,
      <g key="3">
        <rect x="49" y="94" width="213" height="68" fill={paper} />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${65 + i * 16} 95v66`} />
        ))}
        {[0, 1, 3, 4, 5, 7, 8, 10].map((i) => (
          <rect
            key={i}
            x={59 + i * 16}
            y="94"
            width="9"
            height="38"
            fill={ink}
          />
        ))}
      </g>,
      <g key="4">
        <rect x="71" y="48" width="173" height="127" fill={paper} />
        {record(129, 111, 44)}
        <path d="m211 69-13 72-32 6" fill="none" strokeWidth="4" />
      </g>,
      <g key="5">
        <path d="M77 54h157v112H77Z" fill={paper} />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M86 ${78 + i * 15}h136`} />
        ))}
        <path d="M136 76v57m0-42 42-10v41" fill="none" strokeWidth="4" />
        <ellipse cx="126" cy="134" rx="12" ry="8" fill={colour} />
        <ellipse cx="168" cy="123" rx="12" ry="8" fill={colour} />
      </g>,
    ][v];
  if (theme === "photography")
    return [
      <g key="0">
        <rect x="59" y="43" width="190" height="121" fill={paper} />
        <circle cx="105" cy="80" r="18" fill="#c3a371" />
        <path d="m71 152 42-48 29 21 46-57 48 84Z" fill={colour} />
      </g>,
      <g key="1">
        <path d="M80 89h38l12-20h58l14 20h34v78H80Z" fill={colour} />
        <circle cx="158" cy="127" r="31" fill={ink} />
        <circle cx="158" cy="127" r="20" fill={paper} />
        <path d="m158 168-40 87m40-87 40 87" fill="none" />
      </g>,
      <g key="2">
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            transform={`translate(${55 + i * 64} ${50 + (i % 2) * 35}) rotate(${i % 2 ? -8 : 5} 25 40)`}
          >
            <rect width="55" height="82" fill={paper} />
            <rect x="5" y="6" width="45" height="52" fill={colour} />
            <path d="m9 48 17-30 24 30" fill="#a3ac98" />
          </g>
        ))}
      </g>,
      <g key="3">
        <path d="M78 44h154v128H78Z" fill={paper} />
        <path d="M84 137q44-65 72-20t69-28v77H84Z" fill={colour} />
        <path d="M155 45v127M78 105h154" fill="none" />
      </g>,
      <g key="4">
        <path d="M50 60q90 19 210 0" fill="none" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M${80 + i * 64} 64v15`} />
            <rect x={60 + i * 64} y="80" width="47" height="67" fill={paper} />
            <circle cx={83 + i * 64} cy="107" r="14" fill={colour} />
          </g>
        ))}
      </g>,
      <g key="5">
        <rect x="62" y="38" width="182" height="136" fill={ink} />
        <path d="m74 158 40-61 37 45 30-79 50 95Z" fill={colour} />
        <circle cx="112" cy="71" r="13" fill={paper} />
      </g>,
    ][v];
  if (theme === "reading")
    return [
      <g key="0">
        {Array.from({ length: 8 }, (_, i) => (
          <g key={i}>
            {book(65 + i * 22, 55 + (i % 3) * 9, 15, 60 - (i % 3) * 9)}
          </g>
        ))}
        <path d="M55 117h205" />
      </g>,
      <g key="1">
        <path
          d="M65 74q43-26 88 0 45-26 88 0v96q-43-26-88 0-45-26-88 0Z"
          fill={paper}
        />
        <path
          d="M153 74v96M80 92l55 7m-55 13 55 7m34-20 55-7m-55 27 55-7"
          fill="none"
        />
      </g>,
      <g key="2">
        <path
          d="M75 144h157v21H75zm15-22h126v22H90zm-7-24h157v24H83zm25-25h114v25H108Z"
          fill={colour}
        />
        <path d="M92 153h122m-105-20h91" stroke={paper} />
      </g>,
      <g key="3">
        <path d="M61 45h185v128H61Z" fill={paper} />
        <path d="M61 108h185M153 45v128" />
        <path
          d="M89 97V58h19v39m65 0V60h37v37m-99 66v-42h21v42m47 0v-42h42v42"
          fill={colour}
        />
      </g>,
      <g key="4">
        <path d="M57 155h204M83 61h56v79H83Z" fill={colour} />
        <path d="M160 132q22-42 69 0l-15 25h-59Z" fill={paper} />
        <path d="M107 61V43m-25 0h50" />
      </g>,
      <g key="5">
        <path d="M57 151q0-44 48-44h100q46 0 46 44v24H57Z" fill={colour} />
        <path d="M72 105V55h165v50" fill={paper} />
        <path d="m103 87 51 18 51-18v49l-51 17-51-17Z" fill={paper} />
      </g>,
    ][v];
  if (theme === "nature")
    return [
      <g key="0">
        {leaf(89, 144)}
        {leaf(222, 113)}
        <path
          d="M89 144v62m133-93v93m-156 0h46l-7 31H73m129-31h40l-6 31h-29"
          fill={colour}
        />
      </g>,
      <g key="1">
        <path d="M65 43h190v132H65Z" fill={paper} />
        <path d="M159 44v131M65 108h190" />
        {leaf(154, 171)}
        <path d="M154 171v49m-24 0h49l-8 28h-35" fill={colour} />
      </g>,
      <g key="2">
        <path d="M75 62h65l-8 39H83Zm108 0h65l-8 39h-49Z" fill={paper} />
        <path
          d="M89 101q-25 65 10 76m19-76q33 43 11 85m72-85q-8 62 19 83"
          fill="none"
          stroke={colour}
          strokeWidth="7"
        />
      </g>,
      <g key="3">
        <path d="M62 160q88-110 191 0v19H62Z" fill={colour} />
        <circle cx="222" cy="63" r="24" fill="#b4a07d" />
        <path d="m144 85-22 63h45Zm-57 25-17 43h38Z" fill={ink} />
      </g>,
      <g key="4">
        {leaf(110, 114)}
        {leaf(203, 154)}
        <path
          d="M110 114v89m93-49v49M64 204h190M88 203h45v28H88m94-28h41v28h-41"
          fill={paper}
        />
      </g>,
      <g key="5">
        <path d="M60 44h190v130H60Z" fill={paper} />
        <path
          d="M78 157q24-130 44-27 27-109 46 10 39-132 58 17Z"
          fill={colour}
        />
        <path d="M157 175v43m-40 0h80" />
      </g>,
    ][v];
  return [
    <g key="0">
      {screen(61, 58, 190, 110)}
      <path d="M156 169v30m-29 0h58M49 215h220" />
    </g>,
    <g key="1">
      {screen(62, 51, 125, 96)}
      {screen(202, 73, 43, 92)}
      <path d="M79 166h150" />
    </g>,
    <g key="2">
      <rect x="63" y="44" width="185" height="128" fill={ink} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect
          key={i}
          x={78 + (i % 4) * 42}
          y={59 + Math.floor(i / 4) * 35}
          width={18 + (i % 3) * 5}
          height="23"
          fill={i % 2 ? colour : paper}
        />
      ))}
    </g>,
    <g key="3">
      {screen(93, 38, 128, 136)}
      <path d="M108 190h99m-77-1-10 25m70-25 10 25" />
    </g>,
    <g key="4">
      <path d="M72 61h168v99H72Z" fill={paper} />
      <path d="m82 145 33-52 38 42 48-57 26 67" fill={colour} />
      <path d="m54 160-13 20h226l-27-20" fill={ink} />
    </g>,
    <g key="5">
      {screen(56, 58, 94, 87)}
      {screen(174, 58, 85, 87)}
      <path d="M102 145v38m114-38v38M68 184h178" />
    </g>,
  ][v];
}
export default function Scene({ scene, colour }) {
  const { theme, variation: v } = scene;
  return (
    <svg
      viewBox="0 0 320 350"
      role="img"
      aria-label={`Hoodie character exploring ${theme}, illustrated scene ${v + 1}`}
    >
      <rect width="320" height="350" fill={v % 2 ? "#e5dccd" : "#e9e1d5"} />
      <path d="M0 275h320M35 0v275" stroke="#bdb2a1" />
      <g stroke="#554f46" strokeWidth="1.6" strokeLinejoin="round">
        <Artwork theme={theme} v={v} colour={colour} />
        <g transform={`translate(${v % 2 ? 12 : -8} 0)`}>
          <path
            d="M99 350l10-64q4-43 45-48h24q41 8 47 48l9 64"
            fill="#696c62"
          />
          <path
            d="M138 242q-15-18-10-55 3-38 34-38 36 0 38 38l-2 51"
            fill="#302f2b"
          />
          <path d="M120 241q39 30 83-2l11 22q-47 58-99 2z" fill="#cfcec0" />
          <path d="m126 293-5 57m85-57 9 57" fill="none" />
        </g>
      </g>
    </svg>
  );
}
