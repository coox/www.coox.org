module.exports = {
  // https://eslint.org/docs/user-guide/configuring#specifying-environments
  env: {
    // Enable support of all ECMAScript 2020 globals
    // and automatically sets `parserOption.ecmaVersion` to 11
    // to specify usage of ECMAScript syntax version 2020
    es2020: true,
    // Enable support of Node.js global variables and Node.js scoping
    node: true,
  },

  // https://eslint.org/docs/user-guide/configuring#specifying-parser-options
  parserOptions: {
    // Specify that code is in ECMAScript modules
    sourceType: 'module',
  },

  // https://eslint.org/docs/user-guide/configuring#extending-configuration-files
  extends: [
    // Enforce rules that report common problems
    // https://eslint.org/docs/user-guide/configuring#using-eslint-recommended
    'eslint:recommended',
    // Integrate with Prettier by doing three things:
    // - leverage `eslint-config-prettier` to disable all formatting-related
    //   ESLint rules that are unnecessary or might conflict with Prettier
    // - set the `prettier/prettier` rule to `"error"`
    // - enable `eslint-plugin-prettier` to enforce Prettier’s own configuration
    //   (honoring `.prettierignore` and `prettier.config.js`)
    // https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
    'plugin:prettier/recommended',
  ],

  overrides: [
    {
      files: ['src/**/*.js'],
      env: {
        // Enable support of browser global variables
        browser: true,
        // Disable support of Node.js global variables and Node.js scoping
        node: false,
      },
    },
  ],
};
