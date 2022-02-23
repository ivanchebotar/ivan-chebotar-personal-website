const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const ico = require('gulp-to-ico');
const browserSync = require('browser-sync');
const browserify = require('browserify');
const sourse = require('vinyl-source-stream');
const imgMin = require('gulp-imagemin');
const { on } = require('gulp');

gulp.task('server', function () {
  browserSync({
    port: 3005,
    server: {
      baseDir: 'dist'
    }
  })
});

gulp.task('html', function () {
  gulp.src('./src/views/*.html')
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('sass', function () {
  gulp.src('./src/styles/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', function () {
  browserify('./src/js/index.js')
    .bundle()
    .pipe(sourse('index.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('fonts', function () {
  gulp.src('./src/fonts/*.*')
    .pipe(gulp.dest('./dist/fonts/'))
}); 

gulp.task('files', function () {
  // images
  gulp.src('./src/images/*.*')
    .pipe(imgMin())
    .pipe(gulp.dest('./dist/images/'))
    .pipe(browserSync.reload ({
      stream: true
    }));
  // favicon
  gulp.src('./src/*.ico')
    .pipe(gulp.dest('./dist/'))
    .pipe(browserSync.reload ({
      stream: true
    }));
});

gulp.task('watch', function () {
  gulp.watch('./src/views/*.html', ['html']);
  gulp.watch('./src/styles/**/*.scss', ['sass']);
  gulp.watch('./src/js/**/*.js', ['js']);
  gulp.watch('./src/fonts/*.*', ['fonts']);
  gulp.watch('./src/images/*.*', ['files']);
});

gulp.task('build', ['html', 'sass', 'js', 'files', 'fonts']);
gulp.task('default', ['watch', 'server', 'build']);

