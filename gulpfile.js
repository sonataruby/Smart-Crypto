'use strict';
var browserify = require('browserify');
var gulp = require('gulp');
var replace = require('gulp-replace');
var browserSync = require('browser-sync').create();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
const babelify = require("babelify");
const glslify = require("glslify");
const streamify = require('gulp-streamify');
const uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var fs = require('fs');
var jsonAddress = fs.readFileSync(__dirname + '/apps/abi/address.json');
jsonAddress = jsonAddress.toString().trim().replace(/(?:\r\n|\r|\n|\t)/g, '');
jsonAddress = JSON.stringify(jsonAddress);
gulp.task('web3', function() {
    gulp.src('apps/dev/blockchain.js')
        .pipe(replace(/{jsondata}/g, jsonAddress))
        .pipe(concat('blockchain_dev.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("apps/dev"))
        .pipe(browserSync.stream());
    
    return gulp.src([
            'node_modules/web3/dist/web3.min.js',
            'node_modules/web3modal/dist/index.js',
            'node_modules/axios/dist/axios.js',
            'apps/dev/blockchain_dev.js',
            'apps/dev/token.js',
            'apps/dev/airdrop.js',
            'apps/dev/presell.js',
            'apps/dev/ido.js',
            'apps/dev/farm.js',
            'apps/dev/client.js'
        ])
        .pipe(concat('apps.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("public/dist"))
        .pipe(browserSync.stream());
    
});

//gulp.task('clean', () => del(['data/dev/assent/js/*.js', 'data/dev/assent/css/*.css']));

gulp.task('default', gulp.series(['web3'],function(done) { 
    // default task code here
    done();
}));