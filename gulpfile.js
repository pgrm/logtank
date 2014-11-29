var gulp = require('gulp');
var del = require('del');
var spawn = require('child_process').spawn;

var chug = require('gulp-chug');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var embedlr = require('gulp-embedlr');
var gulpif = require('gulp-if');
var htmlify = require('gulp-angular-htmlify');
var htmlmin = require('gulp-htmlmin');
var imagemin = require('gulp-imagemin');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var livereload = require('gulp-livereload');
var mainBowerFiles = require('main-bower-files');
var nodemon = require('gulp-nodemon');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');

var development = true;
var tsServer = ts.createProject({target: 'ES5', declarationFiles: false, noExternalResolve: true});
var tsClient = ts.createProject({target: 'ES5', declarationFiles: false, noExternalResolve: true, sortOutput: true});

function handleError(error) {
  console.error(Date.now.toString() + "\t" + error.toString());
  this.emit('end');
}

gulp.task('default', ['init-node', 'init-bower'], function() {
  development = true;
  gulp.start('client', 'server', 'watch', 'debug');
});

gulp.task('deploy', ['clean', 'init-node', 'init-bower'], function() {
  development = false;
  gulp.start('client', 'server');
});

gulp.task('clean', function(cb) {
  del(['./public'], cb);
});

gulp.task('init-node', function(cb) {
  var npm = spawn('npm', ['install'], {stdio: ['ignore', process.stdout, process.stderr]});
  npm.on('exit', cb);
});

gulp.task('init-bower', function(cb) {
  var bower = spawn('bower', ['install'], {stdio: ['ignore', process.stdout, process.stderr]});
  bower.on('exit', cb);
});

gulp.task('client', ['styles', 'images', 'html', 'scripts-ts', 'scripts-js', 'bower'], function() { });
gulp.task('styles', ['sass-styles', 'fonts'], function() { });

gulp.task('sass-styles', ['angular-material-scss'], function() {
  gulp.src(['./client/assets/themes/default.scss', './client/app/website.scss', './client/tank/app/tank.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass()).pipe(gulpif(!development, csso()))
    .pipe(gulpif(development, sourcemaps.write('./maps')))
    .pipe(gulp.dest('./public/css'))
    .on('error', handleError);
});

gulp.task('angular-material-scss', function() {
  var stylesBaseDir = './client/assets/themes/';
  var customTheme = stylesBaseDir + 'blue-lime/logtank-theme.scss';
  var materialDesignBaseDir = stylesBaseDir + 'material/dist/';
  var themesBaseDir = materialDesignBaseDir + 'themes/'
  var fileName = 'angular-material';

  gulp.src(customTheme).pipe(gulp.dest(stylesBaseDir + 'material/themes'));
  gulp.src(stylesBaseDir + 'material/gulpfile.js').pipe(chug({tasks: ['build']}));
  gulp.src([materialDesignBaseDir + fileName + '.css',
            themesBaseDir + 'logtank-theme.css', 
            themesBaseDir + 'teal-theme.css', 
            themesBaseDir + 'amber-theme.css'])
    .pipe(concat(fileName + '-full.scss'))
    .pipe(gulp.dest(materialDesignBaseDir + 'tmp'));
});

gulp.task('fonts', function() {
  gulp.src('./client/styles/fonts/**/*')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('bower', function() {
  var cssFilter = /.+\.css$/;
  var fontsFilter = /.+\.(eot|svg|ttf|woff|otf)/;
  var jsFilter = /.+\.js$/;

  gulp.src(mainBowerFiles({filter: cssFilter}))
    .pipe(sourcemaps.init())
    .pipe(concat('includes.css')).pipe(gulpif(!development, csso()))
    .pipe(gulpif(development, sourcemaps.write('./maps')))
    .pipe(gulp.dest('./public/css'));

  gulp.src(mainBowerFiles({filter: fontsFilter}))
    .pipe(gulp.dest('./public/fonts'));

  gulp.src(mainBowerFiles({filter: jsFilter}))
    .pipe(sourcemaps.init())
    .pipe(concat('includes.js')).pipe(uglify())
    .pipe(gulpif(development, sourcemaps.write('./maps')))
    .pipe(gulp.dest('./public/scripts'));
});

gulp.task('images', function() {
  gulp.src('./client/images/**/*')
    .pipe(gulpif(!development, imagemin({progressive: true, interlaced: true, optimizationLevel: 7})))
    .pipe(gulp.dest('./public/images'));
});

gulp.task('html', function() {
  gulp.src(['./client/html/website/**/*.html', './client/html/**/*.html'])
    .pipe(gulpif(development, embedlr()))
    .pipe(htmlify()).pipe(htmlmin({removeComments: true, collapseWhitespace: true}))
    .pipe(gulp.dest('./public'));
});

gulp.task('scripts-ts', function() {
  gulp.src(['./client/scripts/**/*.ts', './libs/**/*.ts', './typings/**/*.ts'])
    .pipe(sourcemaps.init())
    .pipe(ts(tsClient)).pipe(concat('app.js')).pipe(uglify())
    .pipe(gulpif(development, sourcemaps.write('./maps')))
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('scripts-js', function() {
  gulp.src('./client/jslibs/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('libs.js')).pipe(uglify())
    .pipe(gulpif(development, sourcemaps.write('./maps')))
    .pipe(gulp.dest('public/scripts'));
});

gulp.task('server', function() {
  spawn('tsc', ['app.ts', '--module', 'commonjs', '--outDir', './private', '--target', 'ES5', '--watch'], {stdio: ['ignore', process.stdout, process.stderr]});
});

gulp.task('debug', function() {
  nodemon({script: './private/app.js', ext: 'js', watch: ['./private', './node_modules'], delay: 10})
    .on('restart', function() {console.log('server restarted')});
});

gulp.task('watch', function() {
  livereload.listen();

  gulp.watch('./client/styles/sass/**/*.sass', ['sass-styles']);
  gulp.watch('./client/styles/fonts/**/*', ['fonts']);
  gulp.watch('./client/html/**/*.html', ['html']);
  gulp.watch('./client/images/**/*', ['images']);
  gulp.watch('./client/jslibs/**/*.js', ['scripts-js']);
  gulp.watch('./client/scripts/**/*.ts', ['scripts-ts']);
  gulp.watch(['./libs/**/*.ts', './typings/**/*.ts'], ['scripts-ts']);
  gulp.watch('./bower_components/**/*', ['bower']);

  gulp.watch('./public/**/*').on('change', livereload.changed);
});
