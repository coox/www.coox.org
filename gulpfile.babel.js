// This configuration file having a name ending witg '.babel.js',
// it is loaded by gulp to be interpreted through Babel transpilation.
// This only works if @babel/register is an explicit project dependency.

import browserSync from 'browser-sync';
import { format as dateFormat, parseISO as dateParseISO } from 'date-fns';
import { enUS as dateLocaleEn } from 'date-fns/locale';
import log from 'fancy-log';
import { rmdir } from 'fs';
import { dest, series, parallel, src, watch } from 'gulp';
import csso from 'gulp-csso';
import fileinclude from 'gulp-file-include';
import filter from 'gulp-filter';
import frontMatter from 'gulp-front-matter';
import gulpif from 'gulp-if';
import injectSvg from 'gulp-inject-svg';
import htmlMinifierTerser from 'gulp-html-minifier-terser';
import nunjucks from 'gulp-nunjucks';
import postcss from 'gulp-postcss';
import sass from 'gulp-sass';
import yaml from 'js-yaml';
import path from 'path';
import dartSass from 'sass';
import { promisify } from 'util';
import webpack from 'webpack';
import { isProductionBuild, output, sources } from './build.config';
import webpackConfig from './webpack.config.babel';

sass.compiler = dartSass;

const server = browserSync.create();

export const clean = async () => {
  await promisify(rmdir)(output.path, { recursive: true });
};

export const buildPages = async () =>
  src([`${sources.pages.path}/${sources.pages.includes}`])
    .pipe(filter([sources.pages.includes, `!${sources.pages.excludes}`]))
    .pipe(
      fileinclude({
        filters: {
          'front-matter': (contentAsJson) => {
            const content = JSON.parse(contentAsJson);
            const contentAsYaml = yaml.safeDump(content);
            return `---\n${contentAsYaml}\n---\n`;
          },
        },
      })
    )
    .pipe(frontMatter({ property: 'data' }))
    .pipe(
      nunjucks.compile(
        {},
        {
          filters: {
            date_format: (string, format = 'MMMM yyyy') => {
              const date = dateParseISO(string);
              return dateFormat(date, format, dateLocaleEn);
            },
          },
        }
      )
    )
    .pipe(
      injectSvg({
        // Currently, gulp-inject-svg resolves SVG file names sloppily.
        // To make it work, it must be passed both a relative path and a trailing slash.
        base: `${path.relative(__dirname, sources.pages.path)}/`,
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
    .pipe(dest(output.path));

export const buildScripts = () =>
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

export const buildStyles = async () =>
  src([`${sources.styles.path}/${sources.styles.includes}`], {
    sourcemaps: isProductionBuild,
  })
    .pipe(filter([sources.styles.includes, `!${sources.styles.excludes}`]))
    .pipe(sass({ includePaths: ['node_modules'] }))
    .pipe(postcss())
    .pipe(gulpif(isProductionBuild, csso()))
    .pipe(dest(output.path, { sourcemaps: '.' }));

export const serve = async () => {
  server.init({
    server: output.path,
  });
};

export const streamStylesToBrowsers = async () =>
  src([`${output.path}/**/*.css`]).pipe(server.stream());

export const signalReloadToBrowsers = async () => server.reload();

export const watchSources = async () => {
  watch(
    [
      `${sources.frontMatter.path}/${sources.frontMatter.includes}`,
      `${sources.pages.path}/${sources.pages.includes}`,
    ],
    series(buildPages, signalReloadToBrowsers)
  );
  watch(
    [`${sources.scripts.path}/${sources.scripts.includes}`],
    series(buildScripts, signalReloadToBrowsers)
  );
  watch(
    [`${sources.styles.path}/${sources.styles.includes}`],
    series(buildStyles, streamStylesToBrowsers)
  );
};

export const build = series(parallel(buildScripts, buildStyles), buildPages);

export const dev = series(clean, build, serve, watchSources);

export default series(clean, build);
