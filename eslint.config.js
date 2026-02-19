import tsParser from "@typescript-eslint/parser"

const config = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {},
  },
  {
    ignores: ["node_modules", "dist", ".next", "build"],
  },
]

export default config
