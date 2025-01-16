import gulp from 'gulp';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import browserSync from 'browser-sync';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import newer from 'gulp-newer';
import uglify from 'gulp-uglify';
import dotenv from 'dotenv';
import tinify from 'gulp-tinify-and-convert';

dotenv.config();

const compileSass = gulpSass(sass);
const bs = browserSync.create();


// Compile HTML
export const html = () => {
  return gulp.src('src/views/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream());
};

// Compile SCSS to CSS
export const styles = () => {
  return gulp.src('src/styles/*.scss')
    .pipe(newer('dist/css'))
    .pipe(compileSass().on('error', compileSass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('dist/css'))
    .pipe(bs.stream());
};

// Minify and Concatenate JS
export const js = () => {
  return browserify('src/js/app.js', { debug: true })
    .transform(babelify.configure({
      presets: ['@babel/preset-env']
    }))
    .bundle()
    .on('error', function (err) {
      console.error("Bundle Error:", err.message);
      this.emit('end');
    })
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(uglify())
    .on('error', function (err) {
      console.error("Uglify Error:", err.message);
      this.emit('end');
    })
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({
      stream: true
    }));
};

// Optimize and Convert Images to WebP
export const images = () => {
  return gulp.src('src/images/**/*.{png,jpg,jpeg}')
    .pipe(newer('dist/images'))
    .pipe(tinify(['image/webp']))
		.pipe(gulp.dest('dist/images'))
    .pipe(bs.stream());
};

// Copy Favicon
export const copyIco = () => {
  return gulp.src('src/images/*.ico')
    .pipe(gulp.dest('dist/images'))
    .pipe(browserSync.stream());
};

// Copy SVG Files Directly
export const svg = () => {
  return gulp.src('src/images/**/*.svg')
    .pipe(newer('dist/images'))
    .pipe(gulp.dest('dist/images'))
    .pipe(bs.stream());
};

// Copy Fonts
export const fonts = () => {
  return gulp.src('src/fonts/**/*.{ttf,woff,woff2,eot,svg}')
    // .pipe(newer('dist/fonts'))
    .pipe(gulp.dest('dist/fonts'))
    .pipe(bs.stream());
};

// Copy Video Files
export const video = () => {
  return gulp.src('src/images/**/*.mp4')
    .pipe(newer('dist/images'))
    .pipe(gulp.dest('dist/images'))
    .pipe(bs.stream());
};

// Watch for file changes
export const watch = () => {
  gulp.watch('src/views/**/*.html', gulp.series(html));
  gulp.watch('src/styles/**/*.scss', styles);
  gulp.watch('src/js/**/*.js', js);
  gulp.watch('src/images/**/*.{png,jpg,jpeg}', images);
  gulp.watch('src/images/**/*.svg', svg);
  gulp.watch('src/images/**/*.mp4', video); 
  gulp.watch('src/fonts/**/*', fonts);
  gulp.watch('src/favicon.png');
};

// Serve and watch for file changes
export const serve = () => {
  bs.init({
    port: 3005,
    server: {
      baseDir: 'dist'
    }
  });

  gulp.watch('src/views/**/*.html', html);
  gulp.watch('src/styles/**/*.scss', styles);
  gulp.watch('src/js/**/*.js', js);
  gulp.watch('src/images/**/*', images);
  gulp.watch('src/images/*.ico', copyIco);
  gulp.watch('src/fonts/**/*', fonts);
  gulp.watch('dist/*.html').on('change', bs.reload);
};

// Default task
export default gulp.series(
  gulp.parallel(html, styles, js, images, svg, copyIco, fonts, video),
  gulp.parallel(serve, watch)
);
