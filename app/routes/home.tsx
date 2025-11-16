import type { Route } from "./+types/home";
import Portfolio from "../portfolio/portfolio";

const SITE_URL = "https://ai-gen-jade.vercel.app";
const SITE_IMAGE = `${SITE_URL}/og-image.jpg`; // Додайте Open Graph зображення

export function meta({ }: Route.MetaArgs) {
  const title = "Vira Mospan - Full-Stack Developer | Portfolio";
  const description = "Портфоліо Vira Mospan - Full-Stack розробник з досвідом створення масштабованих веб-додатків. Досвід роботи з React, Node.js, TypeScript та базами даних. Перегляньте мої проекти та досвід роботи.";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Vira Mospan",
    "jobTitle": "Full-Stack Developer",
    "url": SITE_URL,
    "sameAs": [
      "https://github.com/OmniaCrystalline",
      "https://www.linkedin.com/in/vera-mospan/"
    ],
    "email": "vp.mospan@gmail.com",
    "description": description,
    "knowsAbout": [
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Web Development",
      "Full-Stack Development"
    ]
  };

  return [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: "Full-Stack Developer, React Developer, Node.js, TypeScript, Web Development, Portfolio, Vira Mospan, Frontend Developer, Backend Developer, Україна" },
    { name: "author", content: "Vira Mospan" },
    { name: "robots", content: "index, follow" },
    { name: "language", content: "Ukrainian" },

    // Open Graph
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: SITE_URL },
    { property: "og:image", content: SITE_IMAGE },
    { property: "og:locale", content: "uk_UA" },
    { property: "og:site_name", content: "Vira Mospan Portfolio" },

    // Twitter Card
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: SITE_IMAGE },

    // JSON-LD структуровані дані
    { "script:ld+json": jsonLd },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "canonical", href: SITE_URL },
];

export default function Home() {
  return <Portfolio />;
}
