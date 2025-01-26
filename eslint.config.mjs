import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginHtml from "eslint-plugin-html";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginJsxA11y.configs.recommended,
  pluginHtml.configs.recommended,
  {
    rules: {
      "react/jsx-no-undef": "error",
      "react/no-unknown-property": "error",
      // Add more rules as needed
    }
  }
];
