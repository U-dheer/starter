const config = {
  basePath: "/starter",
  page: {
    pageTitle: "Natours API",
    logo: {
      src: { light: "/starter/logo-light.svg", dark: "/starter/logo-dark.svg" },
      alt: "Natours",
      width: "130px"
    }
  },
  topNavigation: [
    { id: "docs", label: "Documentation" },
    { id: "api", label: "API Reference" }
  ],
  sidebar: {
    docs: [
      {
        type: "category",
        label: "Documentation",
        items: [
          {
            type: "category",
            label: "Getting Started",
            icon: "sparkles",
            items: ["/introduction", "/authentication"]
          },
          {
            type: "category",
            label: "Useful Links",
            collapsible: false,
            icon: "link",
            items: [
              {
                type: "link",
                label: "Zudoku Docs",
                href: "https://zudoku.dev/docs/"
              }
            ]
          }
        ]
      }
    ]
  },
  redirects: [{ from: "/", to: "/introduction" }],
  apis: {
    type: "url",
    input: "https://natours-rho-self.vercel.app/api-json",
    navigationId: "api"
  }
};
export {
  config as default
};
//# sourceMappingURL=zudoku.config.js.map
