coffee     = require 'gulp-coffee'
coffeelint = require 'gulp-coffeelint'
connect    = require 'gulp-connect'
gulp       = require 'gulp'
rename     = require 'gulp-rename'
sass       = require 'gulp-sass'
svgSprite  = require 'gulp-svg-sprites'
uglify     = require 'gulp-uglify'
util       = require 'gulp-util'

gulp.task 'assets', ->

  gulp.src('index.html')
    .pipe connect.reload()

  gulp.src('src/*.scss')
    .pipe(sass())
    .pipe(gulp.dest 'dist')
    .pipe connect.reload()

  gulp.src(['src/*.coffee', 'gulpfile.coffee'])
    .pipe(coffeelint './coffeelint.json')
    .pipe coffeelint.reporter()

  gulp.src('src/*.coffee')
    .pipe(coffee bare: true)
    .on('error', util.log)
    .pipe(gulp.dest 'dist' )
    .pipe(rename suffix: '.min')
    .pipe(uglify mangle: false)
    .pipe(gulp.dest 'dist')
    .pipe connect.reload()

gulp.task 'server', ->
  connect.server livereload: true

gulp.task 'sprites', ->
  gulp.src('svg/*.svg')
    .pipe(svgSprite mode: 'defs', svgId: 'tourjs-symbol-%f')
    .pipe gulp.dest('dist')

gulp.task 'watch', ->
  gulp.watch [
    'gulpfile.coffee'
    'src/*'
    'index.html'
  ], ['assets']

gulp.task 'default', [
  'assets'
  'server'
  'watch'
]
