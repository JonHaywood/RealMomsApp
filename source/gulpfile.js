var gulp = require('gulp');
var rm = require('gulp-rm');
var nodemon = require('gulp-nodemon');
var gulpFilter = require('gulp-filter');

// clean public dist folder
gulp.task('clean-bower-files', function () {
	return gulp.src('./public/dist/*').pipe(rm());
});

// copy bower files to public dist folder
gulp.task('bower-files', ['clean-bower-files'], function () {
	var webFilter = gulpFilter(['**/*.js', '**/*.css', '**/*.png', '**/*.map']);
    var fontFilter = gulpFilter(['**/*.eot', '**/*.woff', '**/*.woff2', '**/*.svg', '**/*.ttf']);

	return gulp.src(['./bower_components/**', '!**/src/**'])
		.pipe(webFilter)
		.pipe(gulp.dest('./public/dist'))
		.pipe(webFilter.restore())
		.pipe(fontFilter)
		.pipe(gulp.dest('./public/dist'));
});

// run  server
gulp.task('default', ['bower-files'], function () {
	nodemon({
		script: 'app.js',
		ext: 'js',
		env: {
			PORT: 8000
		},
		ignore: ['./node_modules/**']
	})
	.on('restart', function () {
		console.log('Restarting!');
	});
});