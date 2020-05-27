import path from 'path';

export const paths = {
  output: path.resolve(__dirname, 'public'),
  pages: path.resolve(__dirname, 'src/pages'),
  scripts: path.resolve(__dirname, 'src/scripts'),
  styles: path.resolve(__dirname, 'src/styles'),
};

export const sources = {
  pages: '**/*.html',
  scripts: '**/*.js',
  styles: '**/*.scss',
};

export const excludes = {
  pages: '**/_partials/**/*.html',
  styles: '**/_partials/**/*.scss',
};

export const isProductionBuild = process.env.NODE_ENV === 'production';
