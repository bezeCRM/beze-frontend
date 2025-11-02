import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactNative from "eslint-plugin-react-native";
import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        __DEV__: true,
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-native": reactNative,
      "@typescript-eslint": typescript,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      "no-unused-vars": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/react-in-jsx-scope": "off",
      "react-native/no-inline-styles": "warn",
      "react-native/no-unused-styles": "warn",
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
  },
];
