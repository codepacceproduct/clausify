module.exports = {
  extends: ["next", "next/core-web-vitals"],
  plugins: ["react-hooks"],
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
  ignorePatterns: ["node_modules", "dist", ".next", "build"],
}

