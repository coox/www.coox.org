module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],

  overrides: [
    {
      test: 'src/**/*.js',
      presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }]],
    },
  ],
};
