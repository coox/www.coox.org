import path from 'path';

export const output = {
  path: path.resolve(__dirname, 'public'),
};

export const sources = {
  frontMatter: {
    path: path.resolve(__dirname, 'src/front-matter'),
    includes: '**/*',
  },
  pages: {
    path: path.resolve(__dirname, 'src/pages'),
    includes: '**/*.html',
    excludes: '**/_partials/**/*.html',
  },
  scripts: {
    path: path.resolve(__dirname, 'src/scripts'),
    includes: '**/*.js',
  },
  styles: {
    path: path.resolve(__dirname, 'src/styles'),
    includes: '**/*.scss',
    excludes: '**/_partials/**/*.scss',
  },
};

export const isProductionBuild = process.env.NODE_ENV === 'production';
