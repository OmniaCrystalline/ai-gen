import type { Route } from "./+types/well-known.$";

// Обробка .well-known маршрутів (Chrome DevTools та інші)
export async function loader() {
  return new Response(null, { status: 404 });
}

export default function WellKnown() {
  return null;
}

