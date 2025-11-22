import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/og", "routes/api.og.tsx"),
  route(".well-known/*", "routes/well-known.$.tsx"),
] satisfies RouteConfig;
