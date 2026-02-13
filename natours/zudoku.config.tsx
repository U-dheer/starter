import type { ZudokuConfig } from "zudoku";

const config: ZudokuConfig = {
  site: {
    title: "Natours API",
    logo: {
      src: { light: "/logo-light.svg", dark: "/logo-dark.svg" },
      alt: "Natours",
      width: "130px",
    },
  },
  navigation: [
    {
      type: "category",
      label: "Documentation",
      items: [
        {
          type: "category",
          label: "Getting Started",
          icon: "sparkles",
          items: [
            "/introduction",
            "/authentication",
          ],
        },
        {
          type: "link",
          to: "/api",
          label: "API Reference",
          icon: "book-open",
        },
        {
          type: "category",
          label: "Useful Links",
          collapsible: false,
          icon: "link",
          items: [
            {
              type: "link",
              icon: "external-link",
              label: "Live Swagger UI",
              to: "http://localhost:3000/api-docs",
            },
            {
              type: "link",
              icon: "book",
              label: "Zudoku Docs",
              to: "https://zudoku.dev/docs/",
            },
          ],
        },
      ],
    },
  ],
  redirects: [{ from: "/", to: "/introduction" }],
  apis: [
    {
      type: "file",
      input: "./apis/openapi.json",
      path: "/api",
    },
  ],
};

export default config;
