import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Configuración para frontend (JS + TS en navegador)
  {
    files: ["**/public/**/*.{js,ts,tsx}"],
    plugins: { js, "@typescript-eslint": tseslint.plugin },
    extends: ["js/recommended", "plugin:@typescript-eslint/recommended"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json", // asegúrate de tenerlo
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        socket: "readonly",
        io: "readonly"
      }
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn"
    }
  },

  // Configuración para backend (JS + TS en Node.js)
  {
    files: ["**/server/**/*.{js,ts}", "**/*.{js,ts}"],
    ignores: ["**/public/**"],
    plugins: { js, "@typescript-eslint": tseslint.plugin },
    extends: ["js/recommended", "plugin:@typescript-eslint/recommended"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "readonly"
      },
      sourceType: "commonjs"
    },
    rules: {
      "no-console": "off", // Útil en desarrollo backend
      "no-unused-vars": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "error",
      "quotes": ["error", "single"],
      "semi": ["error", "always"]
    }
  }
]);
