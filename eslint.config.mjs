// @ts-check

import eslint from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // This pattern is added after the default patterns, which are `["**/node_modules/", ".git/"]`.
    // https://eslint.org/docs/latest/use/configure/ignore#ignoring-directories
    ignores: [".astro/"],
  },
  eslint.configs.recommended,
  tseslint.configs.strict,
  eslintPluginPrettierRecommended
);
