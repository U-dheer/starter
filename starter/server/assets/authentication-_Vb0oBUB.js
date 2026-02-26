import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useMDXComponents } from "zudoku/components";
const excerpt = "The Natours API uses JSON Web Tokens (JWT) for authentication.";
const tableOfContents = [{
  "depth": 2,
  "value": "Protecting Routes",
  "id": "protecting-routes",
  "children": [{
    "depth": 3,
    "value": "Authorization Header",
    "id": "authorization-header"
  }]
}, {
  "depth": 2,
  "value": "How to obtain a token",
  "id": "how-to-obtain-a-token"
}, {
  "depth": 2,
  "value": "Roles and Permissions",
  "id": "roles-and-permissions"
}];
const frontmatter = {
  "title": "Authentication"
};
function _createMdxContent(props) {
  const _components = {
    code: "code",
    h2: "h2",
    h3: "h3",
    li: "li",
    ol: "ol",
    p: "p",
    pre: "pre",
    strong: "strong",
    ...useMDXComponents(),
    ...props.components
  };
  return jsxs(Fragment, {
    children: [jsx(_components.p, {
      children: "The Natours API uses JSON Web Tokens (JWT) for authentication."
    }), "\n", jsx(_components.h2, {
      id: "protecting-routes",
      children: "Protecting Routes"
    }), "\n", jsx(_components.p, {
      children: "Certain routes are protected and require a valid token to be included in the request headers."
    }), "\n", jsx(_components.h3, {
      id: "authorization-header",
      children: "Authorization Header"
    }), "\n", jsxs(_components.p, {
      children: ["To authenticate your requests, include the token in the ", jsx(_components.code, {
        inline: true,
        children: "Authorization"
      }), " header as a Bearer token:"]
    }), "\n", jsx(_components.pre, {
      children: jsx(_components.code, {
        className: "language-http",
        children: "Authorization: Bearer <your-token-here>\n"
      })
    }), "\n", jsx(_components.h2, {
      id: "how-to-obtain-a-token",
      children: "How to obtain a token"
    }), "\n", jsxs(_components.ol, {
      children: ["\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Sign Up"
        }), ": Create a new account via ", jsx(_components.code, {
          inline: true,
          children: "POST /api/v1/users/signup"
        }), "."]
      }), "\n", jsxs(_components.li, {
        children: [jsx(_components.strong, {
          children: "Login"
        }), ": Authenticate with your email and password via ", jsx(_components.code, {
          inline: true,
          children: "POST /api/v1/users/login"
        }), "."]
      }), "\n"]
    }), "\n", jsx(_components.p, {
      children: "Upon successful login or signup, the API will return a JWT in the response body (and often as a cookie)."
    }), "\n", jsx(_components.h2, {
      id: "roles-and-permissions",
      children: "Roles and Permissions"
    }), "\n", jsxs(_components.p, {
      children: ["Some endpoints are restricted to specific user roles (e.g., ", jsx(_components.code, {
        inline: true,
        children: "admin"
      }), ", ", jsx(_components.code, {
        inline: true,
        children: "lead-guide"
      }), "). Ensure your user account has the necessary permissions to access these routes."]
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
//# sourceMappingURL=authentication-_Vb0oBUB.js.map
