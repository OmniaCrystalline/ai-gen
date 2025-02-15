import type { Route } from "./+types/home";
import Portfolio from "../portfolio/portfolio";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Portfolio" },
  ];
}

export default function Home() {
  return <Portfolio />;
}
