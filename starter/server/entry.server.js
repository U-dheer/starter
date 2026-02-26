import { jsx } from "react/jsx-runtime";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import logger from "loglevel";
import { Transform } from "node:stream";
import { renderToPipeableStream, renderToStaticMarkup } from "react-dom/server";
import { createStaticHandler, isRouteErrorResponse, createStaticRouter } from "react-router";
import { RouterError, Zudoku, Layout, ServerError, BootstrapStatic } from "zudoku/components";
import { openApiPlugin } from "zudoku/plugins/openapi";
import "zudoku/plugins/api-catalog";
import { markdownPlugin } from "zudoku/plugins/markdown";
import { redirectPlugin } from "zudoku/plugins/redirect";
import { Sparkles, Link } from "zudoku/icons";
const configuredApiPlugins = [];
const configuredApiCatalogPlugins = [];
configuredApiPlugins.push(openApiPlugin({ "type": "url", "input": "https://natours-rho-self.vercel.app/api-json", "navigationId": "api", "inMemory": true }));
const configuredAuthProvider = void 0;
const docsPluginOptions = [];
const fileImports0 = Object.assign({
  "/pages/introduction.mdx": () => import("./assets/introduction-DtMgb29R.js"),
  "/pages/authentication.mdx": () => import("./assets/authentication-_Vb0oBUB.js")
});
docsPluginOptions.push({
  fileImports: fileImports0,
  defaultOptions: void 0,
  files: "/pages/**/*.{md,mdx}"
});
const configuredDocsPlugins = [markdownPlugin(docsPluginOptions)];
const redirects = [
  {
    "from": "/",
    "to": "/introduction"
  }
];
const configuredRedirectPlugin = redirectPlugin({ redirects });
const configuredSidebar = { "docs": [{ "type": "category", "label": "Documentation", "items": [{ "type": "category", "label": "Getting Started", "icon": Sparkles, "items": [{ "type": "doc", "id": "/introduction", "label": "Welcome to Natours API", "categoryLabel": "Getting Started" }, { "type": "doc", "id": "/authentication", "label": "Authentication", "categoryLabel": "Getting Started" }] }, { "type": "category", "label": "Useful Links", "collapsible": false, "icon": Link, "items": [{ "type": "link", "label": "Zudoku Docs", "href": "https://zudoku.dev/docs/" }] }] }] };
const isNavigationPlugin = (obj) => "getRoutes" in obj && typeof obj.getRoutes === "function";
const convertZudokuConfigToOptions = (config) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  const fallbackLogoLight = ((_a = config.page) == null ? void 0 : _a.logoUrl) ?? "https://cdn.zudoku.dev/logos/zudoku-logo-full-light.svg";
  const fallbackLogoDark = ((_b = config.page) == null ? void 0 : _b.logoUrl) ?? "https://cdn.zudoku.dev/logos/zudoku-logo-full-dark.svg";
  const isUsingFallback = !((_c = config.page) == null ? void 0 : _c.logoUrl) && !((_f = (_e = (_d = config.page) == null ? void 0 : _d.logo) == null ? void 0 : _e.src) == null ? void 0 : _f.light) && !((_i = (_h = (_g = config.page) == null ? void 0 : _g.logo) == null ? void 0 : _h.src) == null ? void 0 : _i.dark);
  return {
    page: {
      ...config.page,
      logo: {
        ...isUsingFallback ? { width: "130px" } : {},
        ...(_j = config.page) == null ? void 0 : _j.logo,
        src: {
          light: ((_m = (_l = (_k = config.page) == null ? void 0 : _k.logo) == null ? void 0 : _l.src) == null ? void 0 : _m.light) ?? fallbackLogoLight,
          dark: ((_p = (_o = (_n = config.page) == null ? void 0 : _n.logo) == null ? void 0 : _o.src) == null ? void 0 : _p.dark) ?? fallbackLogoDark
        }
      }
    },
    slotlets: config.UNSAFE_slotlets,
    metadata: {
      favicon: "https://cdn.zudoku.dev/logos/favicon.svg",
      title: "%s - Zudoku",
      ...config.metadata
    },
    sidebars: configuredSidebar,
    topNavigation: config.topNavigation,
    mdx: config.mdx,
    authentication: configuredAuthProvider,
    plugins: [
      ...configuredDocsPlugins,
      ...configuredApiPlugins,
      ...[],
      ...configuredRedirectPlugin ? [configuredRedirectPlugin] : [],
      ...[],
      ...[],
      ...configuredApiCatalogPlugins,
      ...[],
      ...config.plugins ?? []
    ]
  };
};
const getRoutesByOptions = (options) => {
  const allPlugins = [
    ...options.plugins ? options.plugins : [],
    ...[]
  ];
  const routes = allPlugins.flatMap((plugin) => isNavigationPlugin(plugin) ? plugin.getRoutes() : []).concat({
    path: "*",
    loader: () => {
      throw new Response("Not Found", { status: 404 });
    }
  });
  return routes;
};
const getRoutesByConfig = (config) => {
  const options = convertZudokuConfigToOptions(config);
  const routes = getRoutesByOptions(options);
  return [
    {
      element: /* @__PURE__ */ jsx(Zudoku, { ...options, children: /* @__PURE__ */ jsx(Layout, {}) }),
      children: [
        {
          errorElement: /* @__PURE__ */ jsx(RouterError, {}),
          children: routes
        }
      ]
    }
  ];
};
const render = async ({
  template,
  request: baseRequest,
  response,
  config
}) => {
  const routes = getRoutesByConfig(config);
  const { query, dataRoutes } = createStaticHandler(routes, {
    basename: config.basePath
  });
  const queryClient = new QueryClient();
  const request = baseRequest instanceof Request ? baseRequest : createFetchRequest(baseRequest, response);
  const context = await query(request);
  let status = 200;
  if (context instanceof Response) {
    if ([301, 302, 303, 307, 308].includes(context.status)) {
      return response.redirect(
        context.status,
        context.headers.get("Location")
      );
    }
    throw context;
  } else if (context.errors) {
    const firstError = Object.values(context.errors).find(isRouteErrorResponse);
    if (firstError == null ? void 0 : firstError.status) {
      status = firstError.status;
    }
  }
  const router = createStaticRouter(dataRoutes, context);
  const helmetContext = {};
  const App = /* @__PURE__ */ jsx(
    BootstrapStatic,
    {
      router,
      context,
      queryClient,
      helmetContext
    }
  );
  const { pipe } = renderToPipeableStream(App, {
    onShellError(error) {
      response.status(500);
      response.set({ "Content-Type": "text/html" });
      const html = renderToStaticMarkup(/* @__PURE__ */ jsx(ServerError, { error }));
      response.send(html);
    },
    // for SSG we could use onAllReady instead of onShellReady
    // https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
    onAllReady() {
      response.set({ "Content-Type": "text/html" });
      response.status(status);
      const transformStream = new Transform({
        transform(chunk, encoding, callback) {
          response.write(chunk, encoding);
          callback();
        }
      });
      const [htmlStart, htmlEnd] = template.split("<!--app-html-->");
      if (!htmlStart) {
        throw new Error("No <!--app-html--> found in template");
      }
      response.write(
        htmlStart.replace(
          "<!--app-helmet-->",
          [
            helmetContext.helmet.title.toString(),
            helmetContext.helmet.meta.toString(),
            helmetContext.helmet.link.toString(),
            helmetContext.helmet.style.toString(),
            helmetContext.helmet.script.toString()
          ].join("\n")
        )
      );
      transformStream.on("finish", () => {
        response.end(
          htmlEnd == null ? void 0 : htmlEnd.replace(
            "</body>",
            `<script>window.DATA = ${JSON.stringify(dehydrate(queryClient))}<\/script></body>`
          )
        );
      });
      pipe(transformStream);
    },
    onError(error) {
      status = 500;
      logger.error(error);
    }
  });
};
function createFetchRequest(req, res) {
  const origin = `${req.protocol}://${req.get("host")}`;
  const url = new URL(req.originalUrl || req.url, origin);
  const controller = new AbortController();
  res.on("close", () => controller.abort());
  const headers = new Headers();
  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }
  const init = {
    method: req.method,
    headers,
    signal: controller.signal
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }
  return new Request(url.href, init);
}
export {
  createFetchRequest,
  getRoutesByConfig,
  render
};
//# sourceMappingURL=entry.server.js.map
