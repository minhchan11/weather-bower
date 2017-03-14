var gulp = require('gulp');
var lib = require('bower-files')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var concat = require('gulp-concat');
var del = require('del');
var buildProduction = utilities.env.production;

gulp.task('jsBrowserify', ['concatInterface'],function(){
  return browserify({ entries: ['./tmp/allConcat.js']})
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./build/js'));
});

gulp.task('concatInterface', function() {
  return gulp.src(['./js/*-interface.js'])
    .pipe(concat('allConcat.js'))
    .pipe(gulp.dest('./tmp'));
});

gulp.task("minifyScrpts", ["jsBrowserify"], function(){
  return gulp.src("./build/js/app/js")
  .pipe(uglify())
  .pipe(gulp.dest("./build/js"));
});

gulp.task("clean", function(){
  return del(['build', 'tmp']);
});

gulp.task('jshint', function(){
  return gulp.src(['js/*.js'])
.pipe(jshint())
.pipe(jshint.reporter('default'));
});

gulp.task("build",["clean"], function(){
  if (buildProduction){
    gulp.start('minifyScripts');
  }else{
    gulp.start('jsBrowserify');
  }
});

gulp.task('bowerJS', function () {
  return gulp.src(lib.ext('js').files)
    .pipe(concat('vendor.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./build/js'));
});

gulp.task('bowerCSS', function(){
  return gulp.src(lib.ext('css').files)
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./build/css'));
});
