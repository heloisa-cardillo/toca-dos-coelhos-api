import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import security from "eslint-plugin-security";

export default [
  { ignores: ["dist/", "coverage/"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  security.configs.recommended,
  {
    files: ["scripts/**/*.js", "test/**/*.js"],
    languageOptions: { sourceType: "commonjs", globals: { ...globals.node, ...globals.jest } },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  {
    files: ["public/**/*.js"],
    languageOptions: { sourceType: "script", globals: globals.browser },
  },
];
