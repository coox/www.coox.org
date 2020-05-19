// This configuration file having a name ending witg '.babel.js',
// it is loaded by webpack to be interpreted through Babel transpilation.
// This only works if @babel/register is an explicit project dependency.

import HTMLInlineCSSWebpackPlugin from 'html-inline-css-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

const srcPath = path.resolve(__dirname, 'src');
const buildPath = path.resolve(__dirname, 'build');

const isProductionBuild = process.env.NODE_ENV === 'production';

const buildConfig = {
  mode: isProductionBuild ? 'production' : 'development',
  devtool: isProductionBuild ? 'source-map' : false,

  entry: {
    index: [
      path.resolve(srcPath, 'index-scripts-entry.js'),
      path.resolve(srcPath, 'index-styles-entry.js'),
    ],
  },
  output: {
    path: buildPath,
    filename: '[name].bundle.js',
  },

  plugins: [
    // Inject JavaScript bundle in a deferred <script> tag in built index.html document
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      template: path.resolve(srcPath, 'index.template.html'),
      scriptLoading: 'defer',
      hash: true,
    }),

    // Extract CSS dependencies to their own asset
    // https://webpack.js.org/plugins/mini-css-extract-plugin/
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
    }),

    // Inline extracted CSS dependencies in built index.html document
    // https://github.com/Runjuu/html-inline-css-webpack-plugin#config
    new HTMLInlineCSSWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProductionBuild,
            },
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },

      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};

module.exports = buildConfig;
