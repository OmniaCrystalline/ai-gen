import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse, Link } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, Button } from "@radix-ui/themes";
import { Globe, Save, Github, Linkedin, Mail } from "lucide-react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Portfolio() {
  const [repos, setRepos] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortType, setSortType] = useState("name");
  const [languageFilter, setLanguageFilter] = useState("");
  useEffect(() => {
    fetch("https://api.github.com/users/OmniaCrystalline/repos").then((res) => res.json()).then((data) => setRepos(data)).catch((error) => console.error("Error fetching repos:", error));
  }, []);
  const filteredRepos = repos.filter(
    (repo) => repo.topics.toString().toLowerCase().includes(filter.toLowerCase()) && (languageFilter === "" || repo.language === languageFilter)
  ).sort((a, b) => {
    if (typeof a[sortType] === "string" && typeof b[sortType] === "string") {
      return a[sortType].localeCompare(b[sortType]);
    }
    return 0;
  });
  const languages = [...new Set(repos.map((repo) => repo.language).filter(Boolean))];
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      className: "max-w-4xl mx-auto p-6 space-y-8",
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 1 },
      children: [
        /* @__PURE__ */ jsxs("header", { className: "text-center", children: [
          /* @__PURE__ */ jsx(
            motion.h1,
            {
              className: "text-4xl font-bold",
              initial: { y: -20, opacity: 0 },
              animate: { y: 0, opacity: 1 },
              transition: { duration: 0.8 },
              children: "Vira Mospan"
            }
          ),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              className: "text-lg text-gray-600",
              initial: { y: -10, opacity: 0 },
              animate: { y: 0, opacity: 1 },
              transition: { delay: 0.2, duration: 0.8 },
              children: "Full-Stack Developer | Open Source Contributor"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "About Me" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Passionate full-stack developer with experience in building scalable web applications. I love solving complex problems, contributing to open-source projects, and constantly learning new technologies. My expertise includes React, Node.js, and database management. Let's build something amazing together!" })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Skills" }),
          /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: "Hard Skills" }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc ml-5 text-gray-600", children: [
                /* @__PURE__ */ jsx("li", { children: "JavaScript (ES6+), TypeScript" }),
                /* @__PURE__ */ jsx("li", { children: "React, Next.js" }),
                /* @__PURE__ */ jsx("li", { children: "Node.js, Express" }),
                /* @__PURE__ */ jsx("li", { children: "RESTful APIs, GraphQL" }),
                /* @__PURE__ */ jsx("li", { children: "SQL (PostgreSQL, MySQL), NoSQL (MongoDB)" }),
                /* @__PURE__ */ jsx("li", { children: "Version Control (Git, GitHub)" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: "Soft Skills" }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc ml-5 text-gray-600", children: [
                /* @__PURE__ */ jsx("li", { children: "Problem-solving" }),
                /* @__PURE__ */ jsx("li", { children: "Team collaboration" }),
                /* @__PURE__ */ jsx("li", { children: "Effective communication" }),
                /* @__PURE__ */ jsx("li", { children: "Time management" }),
                /* @__PURE__ */ jsx("li", { children: "Adaptability" }),
                /* @__PURE__ */ jsx("li", { children: "Continuous learning" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Projects" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-5", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Search projects by topics...",
                className: "border p-2 w-full mb-4",
                value: filter,
                onChange: (e) => setFilter(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "border p-2 mb-4",
                value: sortType,
                onChange: (e) => setSortType(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "name", children: "Sort by Name" }),
                  /* @__PURE__ */ jsx("option", { value: "created_at", children: "Sort by Date" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "border p-2 mb-4",
                value: languageFilter,
                onChange: (e) => setLanguageFilter(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Filter by Language" }),
                  languages.map((lang) => /* @__PURE__ */ jsx("option", { value: lang, children: lang }, lang))
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-2 gap-6", children: filteredRepos.map((repo) => repo.homepage && /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { scale: 0.9, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              transition: { duration: 0.5 },
              children: /* @__PURE__ */ jsxs(Card, { className: "p-4 border border-gray-200", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold", children: repo.name }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: repo.description || "No description available" }),
                /* @__PURE__ */ jsxs("p", { className: "flex text-gray-600 gap-1 ", children: [
                  /* @__PURE__ */ jsx(Globe, {}),
                  /* @__PURE__ */ jsx(Link, { className: "text-gray-600 italic", to: repo.homepage, target: "_blank", children: "veiw homepage" })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "flex shrink-0 text-gray-600 gap-1", children: [
                  /* @__PURE__ */ jsx(Save, {}),
                  /* @__PURE__ */ jsx(Link, { className: "text-gray-600 italic flex flex-wrap", to: repo.html_url, target: "_blank", children: "veiw on GitHub" })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 gap-1", children: [
                  "Language: ",
                  repo.language || "Unknown"
                ] }),
                /* @__PURE__ */ jsx("ul", { className: "flex gap-4", children: repo.topics.map((e) => /* @__PURE__ */ jsx("li", { children: e }, e)) })
              ] })
            },
            repo.id
          )) })
        ] }),
        /* @__PURE__ */ jsxs("section", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Experience" }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-5", children: /* @__PURE__ */ jsxs("ul", { children: [
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Сommodity Expert" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 italic", children: '"Foxtrot"' }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Inventory, receipt of goods" })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Loan Manager" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 italic", children: '"Blago/Scarbnitsa"' }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Sales, Marketing, and Customer Service" })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Assistant Accountant" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 italic", children: '"EL-House"' }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Inventory, Accounts Payable, and Accounts Receivable" })
            ] }),
            /* @__PURE__ */ jsxs("li", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Frontend Developer" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600 italic", children: '"freelance"' }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-600", children: "Layout of sites" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("footer", { className: "text-center space-x-4 flex justify-evenly", children: [
          /* @__PURE__ */ jsx(Button, { variant: "ghost", asChild: true, children: /* @__PURE__ */ jsx("a", { href: "https://github.com/OmniaCrystalline", target: "_blank", children: /* @__PURE__ */ jsx(Github, { className: "w-5 h-5" }) }) }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", asChild: true, children: /* @__PURE__ */ jsx("a", { href: "https://www.linkedin.com/in/vera-mospan/", target: "_blank", children: /* @__PURE__ */ jsx(Linkedin, { className: "w-5 h-5" }) }) }),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", asChild: true, children: /* @__PURE__ */ jsx("a", { href: "mailto:vp.mospan@gmail.com", children: /* @__PURE__ */ jsx(Mail, { className: "w-5 h-5" }) }) })
        ] })
      ]
    }
  );
}
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Portfolio"
  }];
}
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Portfolio, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-sOcWZfPH.js", "imports": ["/assets/chunk-IR6S3I6Y-_ARiZTBR.js", "/assets/index-_V34Rnb9.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-BWHevxp9.js", "imports": ["/assets/chunk-IR6S3I6Y-_ARiZTBR.js", "/assets/index-_V34Rnb9.js", "/assets/with-props-1hjJmpgM.js"], "css": ["/assets/root-CSqEBxE5.css"] }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/home-DSgxZdyK.js", "imports": ["/assets/with-props-1hjJmpgM.js", "/assets/chunk-IR6S3I6Y-_ARiZTBR.js", "/assets/index-_V34Rnb9.js"], "css": [] } }, "url": "/assets/manifest-aea6a85a.js", "version": "aea6a85a" };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  publicPath,
  routes
};
