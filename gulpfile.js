'use strict';

var gulp = require('gulp');
var del = require('del');
var spawn = require('child_process').spawn;
var g = require('gulp-load-plugins')();
var client = require('./gulpfile.client');

var dest = './build/';
var development = true;
var tsServer = g.typescript.createProject({target: 'ES5', declarationFiles: false, noExternalResolve: false});

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
  spawn('tsc', ['server/app.ts', '--module', 'commonjs', '--outDir', dest + 'private', '--target', 'ES5', '--watch'], {stdio: 'inherit'});
});

gulp.task('server-test', ['compile-server-test'], function() {
  // gulp.src(dest + 'private/**/*spec.js', {read: false}).pipe(g.mocha({timeout: 60000}));
});

gulp.task('compile-server-test', function() {
  // gulp.src(['./server/**/*spec.ts', './server/typings/tsd.d.ts']).pipe(g.typescript(tsServer)).pipe(gulp.dest(dest + './private/server'));
  // gulp.src(['./libs/**/*spec.ts']).pipe(g.typescript(tsServer)).pipe(gulp.dest(dest + './private/libs'));
});

gulp.task('debug', ['server-test'], function() {
  g.nodemon({
        script: dest + 'private/server/app.js', 
        ext: 'js', 
        watch: [dest + 'private'], 
        delay: 10,
        env: require('./server/config/local.env') || {}
    })
    .on('restart', function() { console.log('server restarted'); });
});

gulp.task('watch', function() {
  g.livereload.listen();

  gulp.watch(['./client/**/*.scss', '!./client/assets/themes/material/**/*'], ['styles']);
  gulp.watch(['./client/**/*.html', '!./client/assets/themes/material/**/*'], ['html']);
  gulp.watch('./client/assets/images/**/*', ['images']);
  gulp.watch('./client/assets/jslibs/**/*.js', ['client-deploy-js']);
  gulp.watch('./client/**/*.ts', ['client-deploy-ts']);

  gulp.watch(dest + 'public/**/*', ['server-test']).on('change', g.livereload.changed);
});
