import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  {files: ["**/*.{js,mjs,cjs,ts}"]},
  {languageOptions: { globals: globals.browser }},
  {
    rules: {
      // outras regras
      "@typescript-eslint/no-explicit-any": "off",
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];