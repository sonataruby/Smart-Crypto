'use strict';
var browserify = require('browserify');
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
const babelify = require("babelify");
const glslify = require("glslify");
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');

gulp.task('web3', function() {
    return gulp.src([
            'node_modules/web3/dist/web3.min.js',
            'node_modules/web3modal/dist/index.js',
            'node_modules/axios/dist/axios.js',
            'public/dev/blockchain.js',
            'public/dev/token.js',
            'public/dev/airdrop.js',
            'public/dev/presell.js',
            'public/dev/ido.js',
            'public/dev/farm.js',
            'public/dev/client.js'
        ])
        .pipe(concat('apps.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("public/dist"))
        .pipe(browserSync.stream());
});
gulp.task('build', function() {
  return browserify('public/dev/client.js',{transform : 'brfs'})
    .transform(babelify, { 
            presets: [ '@babel/preset-env' ], 
            "plugins": [
                    ["@babel/plugin-transform-runtime",{"absoluteRuntime": false,
          "corejs": false,
          "helpers": false,
          "regenerator": true,
          "useESModules": true}]
                ]
    })
    .transform('glslify')
    .bundle()
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('./../dist/apps.js'))
    //.pipe(sourcemaps.init({ loadMaps: true }) )
    //.pipe(streamify(uglify()))
    // Start piping stream to tasks!
    .pipe(gulp.dest('public/dev/'));
    //.pipe(browserSync.stream());;
});
//gulp.task('clean', () => del(['data/dev/assent/js/*.js', 'data/dev/assent/css/*.css']));

gulp.task('default', gulp.series(['web3'],function(done) { 
    // default task code here
    done();
}));