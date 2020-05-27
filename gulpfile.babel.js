// This configuration file having a name ending witg '.babel.js',
// it is loaded by gulp to be interpreted through Babel transpilation.
// This only works if @babel/register is an explicit project dependency.

import browserSync from 'browser-sync';
import log from 'fancy-log';
import { rmdir } from 'fs';
import { dest, series, parallel, src, watch } from 'gulp';
import csso from 'gulp-csso';
import filter from 'gulp-filter';
import gulpif from 'gulp-if';
import injectSvg from 'gulp-inject-svg';
import htmlMinifierTerser from 'gulp-html-minifier-terser';
import nunjucks from 'gulp-nunjucks';
import postcss from 'gulp-postcss';
import sass from 'gulp-sass';
import path from 'path';
import dartSass from 'sass';
import { promisify } from 'util';
import webpack from 'webpack';
import { excludes, isProductionBuild, paths, sources } from './build.config';
import webpackConfig from './webpack.config.babel';

sass.compiler = dartSass;

export const clean = async () => {
  await promisify(rmdir)(paths.output, { recursive: true });
};

export const pages = async () =>
  src([`${paths.pages}/${sources.pages}`])
    .pipe(filter([sources.pages, `!${excludes.pages}`]))
    .pipe(nunjucks.compile())
    .pipe(
      injectSvg({
        // Currently, gulp-inject-svg resolves SVG file names sloppily.
        // To make it work, it must be passed both a relative path and a trailing slash.
        base: `${path.relative(__dirname, paths.pages)}/`,
      })
    )
    .pipe(
      gulpif(
        isProductionBuild,
        htmlMinifierTerser({
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
        })
      )
    )
    .pipe(dest(paths.output));

export const scripts = () =>
  new Promise((resolve, reject) => {
    webpack(webpackConfig, (err, stats) => {
      if (err) {
        reject(err);
      } else if (stats.hasErrors()) {
        reject(new Error(stats.compilation.errors.join('\n')));
      } else {
        log(stats.toString({ colors: true }));
        resolve();
      }
    });
  });

export const styles = async () =>
  src([`${paths.styles}/${sources.styles}`], {
    sourcemaps: isProductionBuild,
  })
    .pipe(filter([sources.styles, `!${excludes.styles}`]))
    .pipe(sass({ includePaths: ['node_modules'] }))
    .pipe(postcss())
    .pipe(gulpif(isProductionBuild, csso()))
    .pipe(dest(paths.output, { sourcemaps: '.' }));

export const serve = async () => {
  watch([`${paths.pages}/${sources.pages}`], pages);
  watch([`${paths.scripts}/${sources.scripts}`], scripts);
  watch([`${paths.styles}/${sources.styles}`], styles);

  browserSync.init({
    server: paths.output,
    watch: true,
    watchEvents: ['add', 'change', 'unlink', 'addDir', 'unlinkDir'],
  });
};

export const build = series(parallel(scripts, styles), pages);

export const localdev = series(clean, build, serve);

export default series(clean, build);
