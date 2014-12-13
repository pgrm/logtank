'use strict';

var gulp = require('gulp');
var del = require('del');
var spawn = require('child_process').spawn;
var g = require('gulp-load-plugins')();
var client = require('./gulpfile.client');

var dest = './dest/';
var development = true;
var tsServer = g.typescript.createProject({target: 'ES5', declarationFiles: false, noExternalResolve: true});

function handleError(error) {
  console.error(Date.now.toString() + "\t" + error.toString());
  this.emit('end');
}

gulp.task('default', ['init-node'], function() {
  development = true;
  client({dest: dest, development: development});
  gulp.start('client', 'server', 'watch', 'debug');
});

gulp.task('test-deploy', ['test-client', 'test-server'], function() {
  gulp.start('deploy');
});

gulp.task('deploy', ['clean'], function() {
  development = false;
  client({dest: dest, development: development});
  gulp.start('client', 'server');
});

gulp.task('clean', function(cb) { del([dest], cb); });

gulp.task('init-node', function(cb) {
  var npm = spawn('npm', ['install'], {stdio: ['ignore', process.stdout, process.stderr]});
  npm.on('exit', cb);
});

gulp.task('server', function() {
  spawn('tsc', ['server/app.ts', '--module', 'commonjs', '--outDir', './private', '--target', 'ES5', '--watch'], {stdio: ['ignore', process.stdout, process.stderr]});
});

gulp.task('debug', function() {
  g.nodemon({
        script: './private/app.js', 
        ext: 'js', 
        watch: ['./private', './node_modules'], 
        delay: 10,
        env: require('./server/config/local.env') || {}
    })
    .on('restart', function() { console.log('server restarted'); });
});

gulp.task('watch', function() {
  g.livereload.listen();

  gulp.watch('./client/styles/sass/**/*.sass', ['sass-styles']);
  gulp.watch('./client/styles/fonts/**/*', ['fonts']);
  gulp.watch('./client/html/**/*.html', ['html']);
  gulp.watch('./client/images/**/*', ['images']);
  gulp.watch('./client/jslibs/**/*.js', ['scripts-js']);
  gulp.watch('./client/scripts/**/*.ts', ['scripts-ts']);
  gulp.watch(['./libs/**/*.ts', './typings/**/*.ts'], ['scripts-ts']);
  gulp.watch('./bower_components/**/*', ['bower']);

  gulp.watch('./public/**/*').on('change', g.livereload.changed);
});
