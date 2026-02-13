import type { ZudokuConfig } from "zudoku";

const config: ZudokuConfig = {
  page: {
    pageTitle: "Natours API",
    logo: {
      src: { light: "/logo-light.svg", dark: "/logo-dark.svg" },
      alt: "Natours",
      width: "130px",
    },
  },
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
            items: ["/introduction", "/authentication"],
          },
          {
            type: "link",
            href: "/api",
            label: "API Reference",
          },
          {
            type: "category",
            label: "Useful Links",
            collapsible: false,
            icon: "link",
            items: [
              {
                type: "link",
                label: "Live Swagger UI",
                href: "https://natours-rho-self.vercel.app/api-docs",
              },
              {
                type: "link",
                label: "Zudoku Docs",
                href: "https://zudoku.dev/docs/",
              },
            ],
          },
        ],
      },
    ],
  },
  redirects: [{ from: "/", to: "/introduction" }],
  apis: [
    {
      type: "file",
      input: "./apis/openapi.json",
    },
  ],
};

export default config;
