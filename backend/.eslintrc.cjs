module.exports = {
  root: true,
  env: { node: true, es2021: true },
  parser: "@typescript-eslint/parser",
  parserOptions: { sourceType: "module" },
  plugins: ["@typescript-eslint", "import"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:import/recommended", "plugin:import/typescript", "prettier"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "import/order": ["warn", { "newlines-between": "always" }]
  }
};
