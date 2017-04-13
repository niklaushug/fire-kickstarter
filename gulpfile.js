var babel = require('gulp-babel');
var browserSync = require("browser-sync").create();
var concat = require('gulp-concat');
var data = require('gulp-data');
var gulp = require('gulp');
var loadJsonFile = require('load-json-file');
var nunjucksRender = require('gulp-nunjucks-render');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');


gulp.task('sass', function () {
    return gulp.src('app/src/scss/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./', {
        includeContent: false,
        sourceRoot: '/app/src/scss'
    }))
    .pipe(gulp.dest('app/dist/css'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});


gulp.task('babel', () => {
    return gulp.src('app/src/js/**/*.js')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(babel({
        presets: ['es2015']
    }))
    .on('error', console.error.bind(console))
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/dist/js'));
});


gulp.task('nunjucks', function() {
    return gulp.src('app/src/pages/**/*.+(html|nunjucks)')
    .pipe(data(() => ({data: loadJsonFile.sync('app/src/data.json')})))
    .pipe(nunjucksRender({
        path: ['app/src/templates']
    }))
    .pipe(gulp.dest('app/dist'))
});


gulp.task('serve', ['sass', 'babel', 'nunjucks'], function() {
    browserSync.init({
        startPath:'./app/dist',
        server:{
            baseDir: './'
        }
    });
    gulp.watch("app/src/scss/*.scss", ['sass']);
    gulp.watch("app/src/js/*.js", ['babel']);
    gulp.watch("app/src/pages/**/*.+(html|nunjucks)", ['nunjucks']);
    gulp.watch("app/src/templates/**/*.+(html|nunjucks)", ['nunjucks']);
    gulp.watch("app/src/data.json", ['nunjucks']);
    gulp.watch("app/src/js/*.js").on('change', browserSync.reload);
    gulp.watch("app/dist/*.html").on('change', browserSync.reload);
});

gulp.task('default',['serve']);
