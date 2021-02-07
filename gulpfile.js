'use strict';

// init
  const { src, dest, watch, parallel, series } = require('gulp'),
        autoprefixer         = require('gulp-autoprefixer'),
        sass                 = require('gulp-sass'),
        concat               = require('gulp-concat'),
        uglify               = require('gulp-uglify'),
        imagemin             = require('gulp-imagemin'),
        browserSync          = require('browser-sync').create(),
        del                  = require('del');

//Begin Dev Compile

// Static server
function browsersync() {
  browserSync.init({
        server: {
          baseDir: "app/"
        },
        notofy: false
  });
};

// SCSS and CSS
function libs() {
	return src('node_modules/slick-carousel/slick/slick.css')
	.pipe(concat('_libs.scss'))
	.pipe(dest('app/scss'))
	.pipe(browserSync.stream())
}

function styles() {
  return src('app/scss/style.scss')
    .pipe(autoprefixer({
        overrideBrowserslist:
        ['last 3 version'],
        grid: true,
      }))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(concat('style.min.css'))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

// JS
function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/mixitup/dist/mixitup.js',
    'app/js/main.js',
  ])
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

//Images
function images() {
  return src('app/images/**/*.*')
  .pipe(imagemin([
    imagemin.gifsicle({interlaced: true}),
    imagemin.mozjpeg({quality: 75, progressive: true}),
    imagemin.optipng({optimizationLevel: 5}),
    imagemin.svgo({
      plugins: [
        {removeViewBox: true},
        {cleanupIDs: false}
      ]
    })
  ]))
  // .pipe(browserSync.stream())
  .pipe(dest('dist/images'))
}

// dist
function build() {
  return src([
    'app/**/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js',
  ], {base: 'app'})
  .pipe(dest('dist'))
}

//del
function cleanDist() {
  return del('dist')
}

// watch
function watching() {
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload);
}

exports.libs = libs;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.browsersync = browsersync;
exports.watching = watching;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, images, build);

// default
exports.default = parallel(libs, styles, scripts, browsersync, watching);
