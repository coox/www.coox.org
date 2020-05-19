// https://prettier.io/docs/en/options.html

module.exports = {
  // Enforce usage of single quotes for string literals
  // https://prettier.io/docs/en/options.html#quotes
  singleQuote: true,

  // https://prettier.io/docs/en/configuration.html#configuration-overrides
  overrides: [
    {
      files: ['*.css', '*.html'],
      options: {
        printWidth: 120,
      },
    },
  ],
};
