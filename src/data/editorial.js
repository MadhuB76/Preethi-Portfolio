export const site = {
  name: "Preethi",
  role: "Developer",
  email: "",
  socials: [
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/preethi-gurrampati-388b79217",
    },
    { label: "GitHub", url: "https://github.com/Preethi3112" },
  ],
  technologies: [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "MongoDB",
  ],
};
export const skillCategories = [
  {
    id: "programming",
    label: "Programming",
    note: "The languages behind the logic.",
    skills: ["Java", "JavaScript", "C"],
    short: ["Java", "JavaScript", "C"],
  },
  {
    id: "web",
    label: "Web & Full Stack",
    note: "From the interface to the server. MERN brings React, Node.js, Express.js and MongoDB together.",
    skills: [
      "HTML5",
      "CSS3",
      "React",
      "Node.js",
      "Express.js",
      "Java Full Stack Development",
    ],
    short: [
      "HTML5",
      "CSS3",
      "React",
      "Node.js",
      "Express.js",
      "Java Full Stack",
    ],
  },
  {
    id: "databases",
    label: "Databases",
    note: "Structure, relationships, and a place for every piece of data.",
    skills: ["MongoDB", "MySQL", "SQL", "Database Management Systems (DBMS)"],
    short: ["MongoDB", "MySQL", "SQL", "DBMS"],
  },
  {
    id: "foundations",
    label: "CS Foundations",
    note: "Thinking through a problem before writing the solution.",
    skills: [
      "Object-Oriented Programming (OOP)",
      "Data Structures and Algorithms (DSA)",
      "Problem-Solving",
      "Exception Handling",
      "Algorithm Complexity Analysis",
    ],
    short: ["OOP", "DSA", "Problem-solving", "Exceptions", "Complexity"],
  },
  {
    id: "data",
    label: "Data & Tools",
    note: "Turning collected data into something clear and useful.",
    skills: [
      "Power BI",
      "Microsoft Excel",
      "Data Collection",
      "Data Cleaning",
      "Data Organisation",
      "Data Analysis",
    ],
    short: [
      "Power BI",
      "Excel",
      "Collection",
      "Cleaning",
      "Organisation",
      "Analysis",
    ],
  },
];
export const chapters = [
  {
    id: "home",
    number: "01",
    label: "Home",
    description: "A little introduction.",
  },
  {
    id: "interests",
    number: "02",
    label: "Interests",
    description: "The things that spark ideas.",
  },
  {
    id: "about",
    number: "04",
    label: "Skills",
    description: "The tools behind the thinking.",
  },
  {
    id: "contact",
    number: "05",
    label: "Contact",
    description: "The next conversation.",
  },
];
chapters.splice(2, 0, {
  id: "projects",
  number: "03",
  label: "Projects",
  description: "Selected work, considered details.",
});
export const interests = [
  {
    id: "dancing",
    note: "One more song. Obviously.",
    label: "Dancing",
    description: "Expressing herself through music and movement.",
    image: "/images/gallery/dance-3.webp",
    images: [
      "/images/gallery/dance-1.webp",
      "/images/gallery/dance-2.webp",
      "/images/gallery/dance-3.webp",
      "/images/gallery/dance-4.webp",
      "/images/gallery/dance-5.webp",
      "/images/gallery/dance-6.webp",
      "/images/gallery/dance-7.webp",
    ],
    position: "50% 40%",
  },
  {
    id: "kdramas",
    note: "The next episode started itself.",
    label: "Binge-watching K-dramas",
    shortLabel: "K-dramas",
    description:
      "Getting hooked on Korean dramas and watching episodes back-to-back.",
    image: "/images/gallery/drama-1.webp",
    images: [
      "/images/gallery/drama-1.webp",
      "/images/gallery/drama-2.webp",
      "/images/gallery/drama-3.webp",
      "/images/gallery/drama-4.webp",
      "/images/gallery/drama-5.webp",
      "/images/gallery/drama-6.webp",
      "/images/gallery/drama-7.webp",
    ],
    position: "50% 65%",
  },
  {
    id: "foodie",
    note: "There’s always room for dessert.",
    label: "Foodie",
    description:
      "Exploring delicious food, enjoying big meals, and trying different dishes.",
    image: "/images/gallery/food-2.webp",
    images: [
      "/images/gallery/food-1.webp",
      "/images/gallery/food-2.webp",
      "/images/gallery/food-3.webp",
      "/images/gallery/food-4.webp",
      "/images/gallery/food-5.webp",
      "/images/gallery/food-6.webp",
      "/images/gallery/food-7.webp",
    ],
    position: "50% 50%",
  },
  {
    id: "posing",
    note: "Camera ready. Camera operating? No.",
    label: "Photography",
    shortLabel: "The poser",
    description:
      "Loves posing for photos rather than being the person behind the camera.",
    image: "/images/gallery/pose-1.webp",
    images: [
      "/images/gallery/pose-1.webp",
      "/images/gallery/pose-2.webp",
      "/images/gallery/pose-3.webp",
      "/images/gallery/pose-4.webp",
      "/images/gallery/pose-5.webp",
      "/images/gallery/pose-6.webp",
      "/images/gallery/pose-7.webp",
    ],
    position: "50% 25%",
  },
  {
    id: "nature",
    note: "Taking the scenic route.",
    label: "Nature Exploration",
    shortLabel: "Nature",
    description:
      "Exploring nature, discovering beautiful places, and enjoying the outdoors.",
    image: "/images/interests/nature-4.webp",
    images: [
      "/images/interests/nature-1.webp",
      "/images/interests/nature-2.webp",
      "/images/interests/nature-3.webp",
      "/images/interests/nature-4.webp",
      "/images/interests/nature-5.webp",
      "/images/interests/nature-6.webp",
      "/images/gallery/nature-7.webp",
    ],
    position: "50% 50%",
  },
  {
    id: "doodling",
    note: "This margin needed a personality.",
    label: "Doodling",
    description:
      "Making little sketches, spontaneous drawings, and playful handwritten illustrations.",
    image: "/images/gallery/doodle-photo-1.webp",
    images: [
      "/images/gallery/doodle-photo-1.webp",
      "/images/gallery/doodle-photo-2.webp",
      "/images/gallery/doodle-photo-3.webp",
      "/images/gallery/doodle-photo-4.webp",
      "/images/gallery/doodle-photo-5.webp",
      "/images/gallery/doodle-photo-6.webp",
      "/images/gallery/doodle-photo-7.webp",
    ],
    position: "50% 50%",
  },
  {
    id: "music",
    note: "Currently romanticising the commute.",
    label: "Music",
    description:
      "Listening to music and finding a soundtrack for everyday moments.",
    image: "/images/gallery/music-7.webp",
    images: [
      "/images/interests/music-1.webp",
      "/images/interests/music-2.webp",
      "/images/interests/music-3.webp",
      "/images/interests/music-4.webp",
      "/images/interests/music-5.webp",
      "/images/interests/music-6.webp",
      "/images/gallery/music-7.webp",
    ],
    position: "50% 30%",
  },
];

const projectEditorialImages = [
  [
    "/images/projects/pastel-facade.webp",
    "/images/projects/geometric-shadow.webp",
  ],
  [
    "/images/projects/rooftop-colour.webp",
    "/images/projects/interior-shadow.webp",
  ],
  [
    "/images/projects/botanical-pink.webp",
    "/images/projects/aalto-stairs.webp",
  ],
];
export const projects = Array.from({ length: 3 }, (_, index) => ({
  id: `project-${index + 1}`,
  number: `0${index + 1}`,
  title: "Project title to be added",
  summary:
    "Original project summary, role, and technologies are awaiting the owner’s content.",
  image: "",
  images: projectEditorialImages[index],
  temporaryImages: true,
  href: "",
  tags: [],
}));
