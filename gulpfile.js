var connect = require('gulp-connect'),
    gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylus = require('gulp-stylus'),
    uglify = require('gulp-uglify');

gulp.task('server', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('assets', function() {
    gulp.src('index.html').pipe(connect.reload());
    gulp.src('src/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
    gulp.src('src/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(['src/*', 'index.html'], ['assets']);
});

gulp.task('default', ['assets', 'server', 'watch']);