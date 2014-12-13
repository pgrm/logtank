'use strict';

var gulp = require('gulp');
var g = require('gulp-load-plugins')();
var mainBowerFiles = require('main-bower-files');

var dest = './build/';
var opts = { development: true};
var tsClient = g.typescript.createProject({target: 'ES5', declarationFiles: false, noExternalResolve: true, sortOutput: true});

module.exports = function(options) { opts = options; }

function handleError(error) {
  console.error(Date.now.toString() + "\t" + error.toString());
  throw error;
}

gulp.task('client', ['assets', 'html', 'client-scripts', 'bower'], function() { });
gulp.task('assets', ['styles', 'images'], function() {});

gulp.task('styles', ['angular-material'], function() {
  gulp.src(['./client/assets/themes/default.scss', './client/app/website.scss', './client/tank/app/tank.scss'])
    .pipe(g.sourcemaps.init())
    .pipe(g.sass()).pipe(g.if(!opts.development, g.csso()))
    .pipe(g.if(opts.development, g.sourcemaps.write('./maps')))
    .pipe(gulp.dest(dest + 'public/css'))
    .on('error', handleError);
});

gulp.task('angular-material', function() {
  var stylesBaseDir = './client/assets/themes/';
  var customTheme = stylesBaseDir + 'blue-lime/logtank-theme.scss';
  var materialDesignBaseDir = stylesBaseDir + 'material/dist/';
  var themesBaseDir = materialDesignBaseDir + 'themes/'
  var fileName = 'angular-material';

  gulp.src(customTheme).pipe(gulp.dest(stylesBaseDir + 'material/themes'));
  gulp.src(stylesBaseDir + 'material/gulpfile.js').pipe(g.chug({tasks: ['build']}));
  gulp.src([materialDesignBaseDir + fileName + '.css',
            themesBaseDir + 'logtank-theme.css', 
            themesBaseDir + 'teal-theme.css', 
            themesBaseDir + 'amber-theme.css'])
    .pipe(g.concat(fileName + '-full.scss'))
    .pipe(gulp.dest(materialDesignBaseDir + 'tmp'));
});

gulp.task('images', function() {
  gulp.src('./client/assets/images/favicon.ico')
    .pipe(g.if(!opts.development, g.imagemin({progressive: true, interlaced: true, optimizationLevel: 7})))
    .pipe(gulp.dest(dest + 'public'));
  gulp.src('./client/assets/images/**/*')
    .pipe(g.if(!opts.development, g.imagemin({progressive: true, interlaced: true, optimizationLevel: 7})))
    .pipe(gulp.dest(dest + 'public/images'));
});

gulp.task('html', function() {
  gulp.src(['./client/**/*.html', '!./client/assets/themes/material/**/*'])
    .pipe(g.if(opts.development, g.embedlr()))
    .pipe(g.angularHtmlify()).pipe(g.htmlmin({removeComments: true, collapseWhitespace: true}))
    .pipe(gulp.dest(dest + 'public'));
});

gulp.task('client-scripts', ['client-deploy-ts', 'client-deploy-js'], function() {});

gulp.task('client-deploy-ts', ['client-test'], function() {
  gulp.src(['./client/app/**/*.ts', './client/components/**/*.ts', './libs/**/*.ts', './client/typings/**/*.ts', '!./**/*.spec.ts', '!./**/*.mock.ts'])
    .pipe(g.sourcemaps.init())
    .pipe(g.typescript(tsClient)).pipe(g.concat('app.js')).pipe(g.uglify())
    .pipe(g.if(opts.development, g.sourcemaps.write('./maps')))
    .pipe(gulp.dest(dest + 'public/scripts'));
});

gulp.task('client-deploy-js', function() {
  gulp.src('./client/assets/jslibs/**/*.js')
    .pipe(g.sourcemaps.init())
    .pipe(g.concat('libs.js')).pipe(g.uglify())
    .pipe(g.if(opts.development, g.sourcemaps.write('./maps')))
    .pipe(gulp.dest(dest + 'public/scripts'));
});

gulp.task('client-test', function() {
  // gulp.src(['./client/app/**/*.ts', './client/components/**/*.ts', './libs/**/*.ts'])
  //   .pipe(g.karma({
  //     configFile: 'karma.conf.js',
  //     action: 'watch'
  //   }))//.on('error', handleError);
});

gulp.task('bower', function() {
  var cssFilter = /.+\.css$/;
  var fontsFilter = /.+\.(eot|svg|ttf|woff|otf)/;
  var jsFilter = /.+\.js$/;

  gulp.src(mainBowerFiles({filter: cssFilter}))
    .pipe(g.sourcemaps.init())
    .pipe(g.concat('includes.css')).pipe(g.if(!opts.development, g.csso()))
    .pipe(g.if(opts.development, g.sourcemaps.write('./maps')))
    .pipe(gulp.dest(dest + 'public/css'));

  gulp.src(mainBowerFiles({filter: fontsFilter}))
    .pipe(gulp.dest(dest + 'public/fonts'));

  gulp.src(mainBowerFiles({filter: jsFilter}))
    .pipe(g.sourcemaps.init())
    .pipe(g.concat('includes.js')).pipe(g.uglify())
    .pipe(g.if(opts.development, g.sourcemaps.write('./maps')))
    .pipe(gulp.dest(dest + 'public/scripts'));
});