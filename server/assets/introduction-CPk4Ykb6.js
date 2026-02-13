import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useMDXComponents } from "zudoku/components";
const excerpt = "Natours is a specialized API for a tour booking application. It provides endpoints to manage tours, users, reviews, and bookings.";
const tableOfContents = [{
  "depth": 2,
  "value": "Getting Started",
  "id": "getting-started"
}, {
  "depth": 2,
  "value": "Key Features",
  "id": "key-features"
}, {
  "depth": 2,
  "value": "Authentication",
  "id": "authentication"
}];
const frontmatter = {
  "title": "Welcome to Natours API"
};
function _createMdxContent(props) {
  const _components = {
    a: "a",
    code: "code",
    h2: "h2",
    li: "li",
    p: "p",
    strong: "strong",
    ul: "ul",
    ...useMDXComponents(),
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "Natours is a specialized API for a tour booking application. It provides endpoints to manage tours, users, reviews, and bookings."
    }), "\n", jsx(_components.h2, {
      id: "getting-started",
      children: "Getting Started"
    }), "\n", jsxs(_components.p, {
      children: ["To start using the Natours API, you can explore the ", jsx(_components.a, {
        href: "api",
        children: "API Reference"
      }), " to see all available endpoints and their requirements."]
    }), "\n", jsx(_components.h2, {
      id: "key-features",
      children: "Key Features"
    }), "\n", jsxs(_components.ul, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Tours"
        }), ": Explore and manage various tours with details like difficulty, price, and ratings."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Users"
        }), ": Secure user authentication and profile management."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Reviews"
        }), ": Read and write reviews for different tours."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Booking"
        }), ": (Coming soon) Book your favorite tours directly through the API."]
      }), "\n"]
    }), "\n", jsx(_components.h2, {
      id: "authentication",
      children: "Authentication"
    }), "\n", jsxs(_components.p, {
      children: ["Most endpoints require authentication using a JWT token. You can obtain a token by logging in or signing up via the ", jsx(_components.code, {
        inline: true,
        children: "/api/v1/users/login"
      }), " or ", jsx(_components.code, {
        inline: true,
        children: "/api/v1/users/signup"
      }), " endpoints."]
    })]
  });
}
function MDXContent(props = {}) {
  const { wrapper: MDXLayout } = {
    ...useMDXComponents(),
    ...props.components
  };
  return MDXLayout ? jsx(MDXLayout, {
    ...props,
    children: jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
export {
  MDXContent as default,
  excerpt,
  frontmatter,
  tableOfContents
};
//# sourceMappingURL=introduction-CPk4Ykb6.js.map
