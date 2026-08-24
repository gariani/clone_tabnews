import js from "@eslint/js";
import globals from "globals";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier/flat";

export default [
  js.configs.recommended,
  ...nextVitals,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  prettier,
  {
    files: ["infra/migrations/**/*.js"],
    rules: { "no-unused-vars": ["error", { args: "none" }] },
  },
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "coverage/**",
    ],
  },
];
