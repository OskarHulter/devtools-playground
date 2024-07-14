const recommended = {
  parser: "@typescript-eslint/parser",
  parserOptions: { sourceType: "module" },
  rules: {
    "@sln/eslint/deprecated-imports": "error",
    "@sln/eslint/deprecated-imports-next-router": "error",
    "@sln/eslint/avoid-web-storage": "error",
    "@sln/eslint/avoid-prisma-client-import-for-enums": "error",
    "@sln/eslint/no-prisma-include-true": "warn",
  },
};

export default recommended;
