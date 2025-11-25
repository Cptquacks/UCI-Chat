import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Configuración BASE para TODOS los archivos JavaScript
  {
    files: ["**/*.js"],
    extends: [
      js.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // Base para Node.js
        ...globals.es2021,
      },
    },
    rules: {
      "semi": ["error", "always"], // ✅ OBLIGATORIO en todos los .js
      "no-console": "off", // ✅ NO warnings para console
      "no-unused-vars": "warn",
      "prefer-const": "error",
      "quotes": ["error", "single"],
    },
  },

  // Override para frontend (navegador) - JavaScript
  {
    files: ["**/public/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser, // Sobrescribe Node.js globals
        ...globals.es2021,
        socket: "readonly",
        io: "readonly",
      },
    },
    // ✅ HEREDA todas las reglas de la base
  },

  // Override para backend - JavaScript
  {
    files: ["**/server/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
      },
      sourceType: "commonjs", // ✅ Específico para backend
    },
    // ✅ Ya NO necesita override para no-console
  },
]);