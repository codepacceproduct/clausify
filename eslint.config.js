import next from "eslint-config-next"

export default [
  ...next,
  {
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
    ignores: ["node_modules", "dist", ".next", "build"],
  },
]
