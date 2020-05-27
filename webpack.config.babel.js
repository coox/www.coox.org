// This configuration file having a name ending witg '.babel.js',
// it is loaded by webpack to be interpreted through Babel transpilation.
// This only works if @babel/register is an explicit project dependency.

import path from 'path';
import { paths, isProductionBuild } from './build.config';

const buildConfig = {
  mode: isProductionBuild ? 'production' : 'development',
  devtool: isProductionBuild ? 'source-map' : false,

  entry: {
    index: [path.resolve(paths.scripts, 'index.js')],
  },
  output: {
    path: paths.output,
    publicPath: '/public',
    filename: '[name].js',
  },

  plugins: [],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: ['babel-loader'],
      },
    ],
  },
};

module.exports = buildConfig;
