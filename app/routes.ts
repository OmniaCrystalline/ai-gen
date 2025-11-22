import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("routes/api.tsx", [
    route("og", "routes/api.og.tsx"),
  ]),
] satisfies RouteConfig;
