'use strict';
var browserify = require('browserify');
var gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
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

let loadDataJSON = (file) => {
    var jsonAddress = fs.readFileSync(__dirname + '/apps/abi/'+file+'.json');
    jsonAddress = jsonAddress.toString().trim().replace(/(?:\r\n|\r|\n|\t)/g, '');
    jsonAddress = JSON.stringify(jsonAddress);
    return jsonAddress;
}
var jsonAddress = loadDataJSON('address');
var jsonSmartToken = loadDataJSON('smarttoken');
var jsonNFTFac = loadDataJSON('nftfactory');
var jsonSmartNFT = loadDataJSON('smartnft');

gulp.task('blockchain', function() {
    return gulp.src('apps/dev/blockchain.js')
        .pipe(replace(/{jsondata}/g, jsonAddress))
        .pipe(replace(/{smarttoken}/g, jsonSmartToken))
        .pipe(replace(/{nftfac}/g, jsonNFTFac))
        .pipe(replace(/{smartnft}/g, jsonSmartNFT))
        
        .pipe(concat('blockchain_dev.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("apps/dev"))
        .pipe(browserSync.stream());
});

gulp.task('bootstrap', function() {
    return gulp.src(["apps/dev/bootstrap.scss","apps/dev/admin.scss"])
        .pipe(sass())
        .pipe(gulp.dest("server/public/dist"))
        .pipe(browserSync.stream());
});


gulp.task('game', function() {
    
    return gulp.src([
            
            'apps/dev/game_1.js'
        ])
        .pipe(concat('game_1.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("public/dist"))
        .pipe(browserSync.stream());
    
});


gulp.task('web3', function() {
    
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

gulp.task('web3admin', function() {
    
    
    gulp.src([
            'node_modules/jquery/dist/jquery.js', 
            'node_modules/popper.js/dist/umd/popper.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/axios/dist/axios.js'
            
        ])
        .pipe(concat('jquery.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("server/public/dist"))
        .pipe(browserSync.stream());

    
    
    return gulp.src([
            'node_modules/web3/dist/web3.min.js',
            'node_modules/web3modal/dist/index.js',
            'apps/dev/blockchain_dev.js',
            'apps/dev/token.js',
            //'apps/dev/airdrop.js',
            //'apps/dev/presell.js',
            //'apps/dev/ido.js',
            //'apps/dev/farm.js',
            'apps/dev/admin.js'
        ])
        .pipe(concat('web3admin.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("server/public/dist"))
        .pipe(browserSync.stream());
    
});

//gulp.task('clean', () => del(['data/dev/assent/js/*.js', 'data/dev/assent/css/*.css']));

gulp.task('default', gulp.series(['blockchain','web3','web3admin','bootstrap','game'],function(done) { 
    // default task code here
    done();
}));