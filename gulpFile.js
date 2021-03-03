const { dest, watch, parallel, src } = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const scss = require('gulp-sass');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');

const styles = () => {
  return src(['./src/scss/*.scss', '!./src/scss/_*.scss'])
    .pipe(scss({ outputStyle: 'expanded' }))
    .pipe(autoprefixer({
      cascade: true,
      overrideBrowserslist: ['last 5 versions']
    }))
    .pipe(concat('main.css'))
    .pipe(dest('./docs/css/'))
    .pipe(browserSync.stream());
}

const html = () => {
  return src('./src/*.html')
    .pipe(dest('./docs/'))
    .pipe(browserSync.stream());
}

const js = () => {
  return src('./src/js/*.js')
    .pipe(webpack())
    .pipe(concat('main.js'))
    .pipe(dest('./docs/js/'))
    .pipe(browserSync.stream());
}

const images = () => {
  return src('./src/images/**/*')
    .pipe(dest('./docs/images/'))
    .pipe(browserSync.stream());
}

const server = () => {
  browserSync.init({
    server: {
      baseDir: './docs/'
    }
  });
}

const watching = () => {
  watch('./src/scss/*.scss', parallel(styles));
  watch('./src/images/**/*', parallel(images));
  watch('./src/js/*.js', parallel(js));
  watch('./src/*.html', parallel(html));
}

exports.build = parallel(styles, html, js, images);
exports.default = parallel(exports.build, server, watching);