export default function GalleryCharacter() {
  return (
    <svg
      className="gallery-character"
      viewBox="0 0 300 380"
      role="img"
      aria-label="A girl in a charcoal hoodie, seen from behind, looking at the gallery wall"
    >
      <defs>
        <linearGradient id="hoodie" x1="0" x2="1">
          <stop stopColor="#272824" />
          <stop offset=".5" stopColor="#4b4c45" />
          <stop offset="1" stopColor="#292b27" />
        </linearGradient>
        <pattern id="weave" width="5" height="5" patternUnits="userSpaceOnUse">
          <path
            d="m0 1 5 2M1 0l2 5"
            stroke="#d6d0c5"
            strokeWidth=".3"
            opacity=".16"
          />
        </pattern>
      </defs>
      <ellipse cx="148" cy="365" rx="130" ry="12" fill="#171615" opacity=".1" />
      <path
        d="M107 119q-21-30-14-66Q99 8 143 6q55-2 60 55l-6 66Z"
        fill="#242521"
      />
      <path
        d="M80 151Q41 171 29 232l-9 109q12 27 40 22l22-84-5 101h150l-7-102 21 83q29 6 40-20l-12-109q-14-61-49-81Z"
        fill="url(#hoodie)"
        stroke="#242521"
        strokeWidth="2"
      />
      <path
        d="M80 151Q41 171 29 232l-9 109q12 27 40 22l22-84-5 101h150l-7-102 21 83q29 6 40-20l-12-109q-14-61-49-81Z"
        fill="url(#weave)"
      />
      <path
        d="m91 127-15 30q16 70 72 87 55-20 78-87l-22-32q-53 42-113 2Z"
        fill="#a8aaa0"
        stroke="#393c35"
        strokeWidth="2"
      />
      <path
        d="M94 142q45 47 106 0M83 167q23 47 65 63 39-19 66-60M77 281l-16-55m161 55 17-55M104 271q-12 61-9 106m105-108q11 63 7 108"
        stroke="#777b70"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M110 35q-15 42-2 84m24-99q-11 42-7 72m52-66q18 37 12 91"
        stroke="#484a42"
        fill="none"
      />
    </svg>
  );
}
