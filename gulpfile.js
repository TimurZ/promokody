var gulp = require('gulp'),
		sass = require('gulp-sass'),
		sourcemaps = require('gulp-sourcemaps'),
		autoprefixer = require('gulp-autoprefixer'),
		postcss = require('gulp-postcss'),
		mqpacker = require('css-mqpacker'),
		spritesmith = require('gulp.spritesmith'),
		// build
		htmlreplace = require('gulp-html-replace'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		minifyCss = require('gulp-minify-css'),
		rimraf = require('rimraf'); // remove directory

var params = {
	src: 'app/',
	out: 'dist/',
	// https://github.com/ai/browserslist
	prefixer: ['last 3 versions', 'ie >= 9'],
	mqSort: true // only supports min-width queries
}

//					 SASS-CSS
// =============================================
gulp.task('sass', function () {
	gulp.src(params.src + 'sass/*.scss')
		.pipe(sourcemaps.init())
			.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
			.pipe(autoprefixer({browsers: params.prefixer}))
			// standart gulp plugin like combine media queries
			// doesn't support sourcemaps and messes it up
			.pipe(postcss([
				mqpacker({sort: params.mqSort})
			]))
		.pipe(sourcemaps.write('maps'))
		.pipe(gulp.dest(params.src + 'css'));
});

//					 CLEAN
// =============================================
// remove distribution directory before build
gulp.task('clean', function (cb) {
   rimraf(params.out, cb);
});

//					 HTML
// =============================================
// parse HTML to replace non-optimized references
gulp.task('html', ['clean'], function () {
	gulp.src(params.src + '*.html')
		.pipe(htmlreplace({
			'js': ['js/plugins.min.js', 'js/scripts.min.js']
		}))
		.pipe(gulp.dest(params.out));
});

//					 CSS
// =============================================
// minify css
gulp.task('minCss', ['clean'], function () {
	gulp.src(params.src + 'css/*.css')
		.pipe(minifyCss())
		.pipe(gulp.dest(params.out + 'css'));
});

//					 JS
// =============================================
// concat && uglify js
gulp.task('js', ['clean'], function() {
	var libs = gulp.src(params.src + 'js/libs/**'), // all files
			plugins = gulp.src(params.src + 'js/plugins/**/*.js'),
			scripts = gulp.src(params.src + 'js/scripts/**/*.js');

	libs
		.pipe(gulp.dest(params.out + 'js/libs'));

	plugins
		.pipe(concat('plugins.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(params.out + 'js'));

	scripts
		.pipe(concat('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(params.out + 'js'));
});

//					 COPY
// =============================================
gulp.task('copy', ['clean'], function() {
	// images w/o subfolders
	var images = gulp.src(params.src + 'images/*.*'),
			fonts = gulp.src(params.src + 'fonts/**');

	images
		.pipe(gulp.dest(params.out + 'images'));

	fonts
		.pipe(gulp.dest(params.out + 'fonts'));
});

//					 BUILD
// =============================================
gulp.task('build', ['html', 'minCss', 'js', 'copy']);

//					 WATCH
// =============================================
gulp.task('watch', function () {
	gulp.watch(params.src + 'sass/**/*.scss', ['sass']);
});

//					 DEFAULT
// =============================================
gulp.task('default', ['sass', 'watch']);

//					 SPRITE
// =============================================
gulp.task('sprite', function() {
	var sprite = gulp.src(params.src + 'images/sprite/*.png').pipe(spritesmith({
		retinaSrcFilter: [params.src + 'images/sprite/*@2x.png'],
		imgName: 'sprite.png',
		retinaImgName: 'sprite@2x.png',
		cssName: '_sprite.scss'
	}));

	sprite.img.pipe(gulp.dest(params.src + 'images'));
	sprite.css.pipe(gulp.dest(params.src + 'sass/modules'));
});

//					 SPRITE-FALLBACK
// =============================================
// gulp.task('sprite-fallback', function() {
// 	var fallback = gulp.src(params.src + 'images/fallback/*.png').pipe(spritesmith({
// 		imgName: 'sprite_fallback.png',
// 		cssName: '__temp.scss'
// 	}));

// 	fallback.img.pipe(gulp.dest(params.src + 'images'));
// 	fallback.css.pipe(gulp.dest(params.src + 'sass/modules'));
// });