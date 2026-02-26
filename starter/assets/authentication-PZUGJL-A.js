import{P as i,j as e}from"./entry.client-CvNdQT3Y.js";const s="The Natours API uses JSON Web Tokens (JWT) for authentication.",a=[{depth:2,value:"Protecting Routes",id:"protecting-routes",children:[{depth:3,value:"Authorization Header",id:"authorization-header"}]},{depth:2,value:"How to obtain a token",id:"how-to-obtain-a-token"},{depth:2,value:"Roles and Permissions",id:"roles-and-permissions"}],d={title:"Authentication"};function o(t){const n={code:"code",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",...i(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(n.p,{children:"The Natours API uses JSON Web Tokens (JWT) for authentication."}),`
`,e.jsx(n.h2,{id:"protecting-routes",children:"Protecting Routes"}),`
`,e.jsx(n.p,{children:"Certain routes are protected and require a valid token to be included in the request headers."}),`
`,e.jsx(n.h3,{id:"authorization-header",children:"Authorization Header"}),`
`,e.jsxs(n.p,{children:["To authenticate your requests, include the token in the ",e.jsx(n.code,{inline:!0,children:"Authorization"})," header as a Bearer token:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-http",children:`Authorization: Bearer <your-token-here>
`})}),`
`,e.jsx(n.h2,{id:"how-to-obtain-a-token",children:"How to obtain a token"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Sign Up"}),": Create a new account via ",e.jsx(n.code,{inline:!0,children:"POST /api/v1/users/signup"}),"."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Login"}),": Authenticate with your email and password via ",e.jsx(n.code,{inline:!0,children:"POST /api/v1/users/login"}),"."]}),`
`]}),`
`,e.jsx(n.p,{children:"Upon successful login or signup, the API will return a JWT in the response body (and often as a cookie)."}),`
`,e.jsx(n.h2,{id:"roles-and-permissions",children:"Roles and Permissions"}),`
`,e.jsxs(n.p,{children:["Some endpoints are restricted to specific user roles (e.g., ",e.jsx(n.code,{inline:!0,children:"admin"}),", ",e.jsx(n.code,{inline:!0,children:"lead-guide"}),"). Ensure your user account has the necessary permissions to access these routes."]})]})}function c(t={}){const{wrapper:n}={...i(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(o,{...t})}):o(t)}export{c as default,s as excerpt,d as frontmatter,a as tableOfContents};
//# sourceMappingURL=authentication-PZUGJL-A.js.map
