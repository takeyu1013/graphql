module.exports = {
  schema: "src/generated/schema.graphql",
  exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
  language: "typescript",
  artifactDirectory: "src/queries/__generated__",
};
