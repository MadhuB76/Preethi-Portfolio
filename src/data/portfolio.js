export const site = {
  email: "",
  socials: [],
  technologies: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "MongoDB",
  ],
};
export const interests = [
  [
    "art",
    "Art & illustration",
    "Finding ideas in colour and everyday details.",
    "#b87966",
  ],
  ["music", "Music", "Finding a rhythm in the quiet moments.", "#858099"],
  [
    "photography",
    "Photography",
    "Pausing to notice the light and the in-between.",
    "#789599",
  ],
  [
    "reading",
    "Reading",
    "Getting lost in a page. Coming back with an idea.",
    "#b09163",
  ],
  ["nature", "Nature", "Room to breathe and let curiosity grow.", "#7f906f"],
  [
    "code",
    "Creative coding",
    "A small experiment. An unexpected possibility.",
    "#97829b",
  ],
].map(([id, label, description, colour]) => ({
  id,
  label,
  description,
  colour,
  scenes: Array.from({ length: 6 }, (_, variation) => ({
    theme: id,
    variation,
    image: `/images/interests/${id}-${variation + 1}.webp`,
    alt: `${label}, photographic study ${variation + 1}`,
  })),
}));
export const projects = [
  {
    number: "01",
    title: "Project one",
    category: "Category awaiting confirmation",
    summary:
      "Project title, original imagery, role, technologies, and summary will be added here. This is a clearly marked space for real work.",
    href: "",
  },
  {
    number: "02",
    title: "Project two",
    category: "Category awaiting confirmation",
    summary:
      "A second project space. Details and original screenshots are awaiting the owner’s content; no product or outcome is claimed.",
    href: "",
  },
  {
    number: "03",
    title: "Project three",
    category: "Category awaiting confirmation",
    summary:
      "A third project space. Replace this placeholder with the actual challenge, implementation, and a real project link.",
    href: "",
  },
];
