import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Configuración para frontend (navegador)
  {
    files: ["**/public/**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        socket: "readonly",
        io: "readonly"
      }
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": "error"
    }
  },

  // Configuración para backend (Node.js)
  {
    files: ["**/server/**/*.js", "**/*.js"],
    ignores: ["**/public/**"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
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
      "prefer-const": "error",
      "quotes": ["error", "single"],
      "semi": ["error", "always"]
    }
  }
]);