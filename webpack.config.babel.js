// This configuration file having a name ending witg '.babel.js',
// it is loaded by webpack to be interpreted through Babel transpilation.
// This only works if @babel/register is an explicit project dependency.

import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HTMLInlineCSSWebpackPlugin from 'html-inline-css-webpack-plugin';
import HtmlWebpackInlineSVGPlugin from 'html-webpack-inline-svg-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';

const srcPath = path.resolve(__dirname, 'src');
const entriesPath = path.resolve(srcPath, 'entries');
const templatesPath = path.resolve(srcPath, 'templates');
const buildPath = path.resolve(__dirname, 'build');

const isProductionBuild = process.env.NODE_ENV === 'production';

const buildConfig = {
  mode: isProductionBuild ? 'production' : 'development',
  devtool: isProductionBuild ? 'source-map' : false,

  entry: {
    index: [
      path.resolve(entriesPath, 'index-scripts-entry.js'),
      path.resolve(entriesPath, 'index-styles-entry.js'),
    ],
    resume: [path.resolve(entriesPath, 'resume/index-styles-entry.js')],
  },
  output: {
    path: buildPath,
    filename: '[name].bundle.js',
  },

  plugins: [
    // Remove all files inside webpack’s `output.path` directory
    // https://github.com/johnagan/clean-webpack-plugin#usage
    new CleanWebpackPlugin(),

    // Create HTML documents to serve entry chunks
    // JavaScript bundles are referenced by an injected <script> tag
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      template: path.resolve(templatesPath, 'index.template.html'),
      scriptLoading: 'defer',
      hash: true,
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'resume/index.html',
      template: path.resolve(templatesPath, 'resume/index.template.html'),
      inject: false,
      hash: true,
      chunks: ['resume'],
    }),

    // Inline all SVGs referenced by `<img>` tags in HTML document
    // Since `runPreEmit` is true, this is done before html-webpack-plugin parsing
    // https://github.com/theGC/html-webpack-inline-svg-plugin
    new HtmlWebpackInlineSVGPlugin({
      inlineAll: true,
      runPreEmit: true,
    }),

    // Extract CSS dependencies to their own asset
    // https://webpack.js.org/plugins/mini-css-extract-plugin/
    new MiniCssExtractPlugin({
      filename: '[name].bundle.css',
    }),

    // Inline extracted CSS assets in HTML document
    // https://github.com/Runjuu/html-inline-css-webpack-plugin#config
    new HTMLInlineCSSWebpackPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.template\.html$/,
        use: [
          { loader: 'html-loader' },
          {
            loader: 'nunjucks-html-loader',
            options: {
              searchPaths: [templatesPath],
            },
          },
        ],
      },

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

      {
        test: /\.svg$/,
        use: {
          loader: 'file-loader',
          options: {
            // HACK: `name` must be set to same path+filename as original resource
            //       to allow html-webpack-inline-svg-plugin to work with webpack-dev-server
            //       https://github.com/theGC/html-webpack-inline-svg-plugin/issues/19#issuecomment-548639977
            name: '[path][name].[ext]',
            // Do not actually emit SVG files in build
            emitFile: false,
          },
        },
      },
    ],
  },
};

module.exports = buildConfig;
