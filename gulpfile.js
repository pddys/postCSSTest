'use strict';

//
// TO DO:
//
// Run views through sync
// Seperate Build and Watch scripts
// Deploy script
 
var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
const postcss = require('gulp-postcss');
const postcssPresetEnv = require('postcss-preset-env');

// Must have values, don't use leading or trailing slashes.
const dirs = {
  entry: 'src',
  output: 'build',
};

// Must have values, don't use leading or trailing slashes.
const paths = {
  public: {
    src: `${dirs.entry}/public/**/*`,
    dest: `${dirs.output}`,
  },
  views: {
    root: `${dirs.entry}/views`,
    watch: `${dirs.entry}/views/**/*.+(html|json|njk|nunjucks)`,
    src: `${dirs.entry}/views/*.+(html|njk|nunjucks)`,
    dest: `${dirs.output}`,
  },
  fonts: {
    src: `${dirs.entry}/assets/fonts/*`,
    dest: `${dirs.output}/assets/fonts`,
  },
  media: {
    src: `${dirs.entry}/assets/media/*`,
    dest: `${dirs.output}/assets/media`,
  },
  sass: {
    src: `${dirs.entry}/assets/*.+(css|scss)`,
    dest: `${dirs.output}/assets/css`,
  },
  js: {
    src: [
      `${dirs.entry}/assets/**/*.js`,
      `!${dirs.entry}/assets/**/*.module.js`,
    ],
    dest: `${dirs.output}/assets/js`,
  },
};

const pluginConfig = {
  cleanCSS: [
    { debug: true },
    ({ name, stats }) => {
      console.log(`Original size of ${name}: ${stats.originalSize} bytes`);
      console.log(`Minified size of ${name}: ${stats.minifiedSize} bytes`);
    }
  ],
  browserSync: {
    port: process.env.PORT || 3000,
    server: { baseDir: `${dirs.output}` },
    index: "/index.html"
  }
}


gulp.task('views', function () {
    return gulp.src(paths.views.src)
    .pipe(gulp.dest(paths.views.dest))
});

gulp.task('fonts', function () {
    return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
});

gulp.task('media', function () {
    return gulp.src(paths.media.src)
    .pipe(gulp.dest(paths.media.dest))
});

sass.compiler = require('node-sass');
 
gulp.task('sass', function () {
  // compile src/assets/sass into build/css
  return gulp.src(paths.sass.src)
	.pipe(sourcemaps.init())
	.pipe(cleanCSS(...pluginConfig.cleanCSS))
  .pipe(
    postcss([
      postcssPresetEnv(/* pluginOptions */)
    ])
  )
	.pipe(gulp.dest(paths.sass.dest))
	.pipe(browserSync.stream());
});


gulp.task('js', function () {
	// compile src/assets/js into build/js
  	return gulp.src(paths.js.src)
    .pipe(gulp.dest(paths.js.dest))
});


gulp.task('watch', function () {
	browserSync.init(pluginConfig.browserSync)
    gulp.watch(paths.sass.src, gulp.series('sass'))
    gulp.watch(paths.views.src, gulp.series('views'))
    gulp.watch(paths.media.src, gulp.series('media'))
    gulp.watch(paths.js.src, gulp.series('js'))
    gulp.watch(paths.views.src).on('change',browserSync.reload)
    gulp.watch(paths.js.src).on('change', browserSync.reload)
})

// exports.watch = watch;


gulp.task('default',
	gulp.series(
	'sass',
	'js',
	'views',
	'fonts',
	'media',
	'watch'
));

// function defaultTask(cb) {
//   //
//   // place code for your default task here
//   //

//   // compile src/assets/sass into build/css
//   return gulp.src('./src/assets/sass/**/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(gulp.dest('./build/assets/css'));


//   cb();
// }

// exports.default = defaultTask