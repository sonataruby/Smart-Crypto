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
var jsonAirdrop = loadDataJSON('airdrop');
var jsonPresell = loadDataJSON('presell');
var jsonIDO = loadDataJSON('ido');
var jsonFarm = loadDataJSON('farm');
var jsonNFTFac = loadDataJSON('nftfactory');
var jsonSmartNFT = loadDataJSON('smartnft');
var jsonNFTMarket = loadDataJSON('nftmarket');
var jsonNFTItem = loadDataJSON('nftitem');
var jsonStaking = loadDataJSON('staking');

gulp.task('blockchain', function() {
    return gulp.src('dev/blockchain.js')
        .pipe(replace(/{jsondata}/g, jsonAddress))
        .pipe(replace(/{smarttoken}/g, jsonSmartToken))
        .pipe(replace(/{airdrop}/g, jsonAirdrop))
        .pipe(replace(/{presell}/g, jsonPresell))
        .pipe(replace(/{ido}/g, jsonIDO))
        .pipe(replace(/{nftfac}/g, jsonNFTFac))
        .pipe(replace(/{smartnft}/g, jsonSmartNFT))
        .pipe(replace(/{nftmarket}/g, jsonNFTMarket))
        .pipe(replace(/{nftitem}/g, jsonNFTItem))
        .pipe(replace(/{stacking}/g, jsonStaking))
        .pipe(replace(/{farm}/g, jsonFarm))
       
        .pipe(concat('blockchain_dev.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("dev"))
        .pipe(browserSync.stream());
});

gulp.task('bootstrap', function() {
    gulp.src(["dev/account.scss"])
        .pipe(sass())
        .pipe(gulp.dest("public/dist"))
        .pipe(browserSync.stream());

    gulp.src(["dev/bootstrap.scss"])
        .pipe(sass())
        .pipe(gulp.dest("public/dist"))
        .pipe(browserSync.stream());
    return gulp.src(["dev/bootstrap.scss","dev/admin.scss"])
        .pipe(sass())
        .pipe(gulp.dest("server/public/dist"))
        .pipe(browserSync.stream());
});


gulp.task('game', function() {
    
    return gulp.src([
            
            'dev/game_1.js'
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
            'dev/blockchain_dev.js',
            'dev/token.js',
            //'dev/airdrop.js',
            //'dev/presell.js',
            //'dev/ido.js',
            //'dev/farm.js',
            //'dev/client.js'
        ])
        .pipe(concat('apps.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("public/dist"))
        .pipe(browserSync.stream());
    
});

gulp.task('airdrop', function() {
    
    return gulp.src([
            'dev/airdrop.js',
            //'dev/ido.js',
        ])
        .pipe(concat('airdrop.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("public/dist"))
        .pipe(browserSync.stream());
    
});

gulp.task('presell', function() {
    
    return gulp.src([
            'dev/presell.js',
            //'dev/ido.js',
        ])
        .pipe(concat('presell.js'))
        .pipe(uglify())
        .pipe(gulp.dest("public/dist"))
        .pipe(browserSync.stream());
    
});

gulp.task('ido', function() {
    
    return gulp.src([
            'dev/ido.js',
        ])
        .pipe(concat('ido.js'))
        .pipe(uglify())
        .pipe(gulp.dest("public/dist"))
        .pipe(browserSync.stream());
    
});

gulp.task('farm', function() {
    
    return gulp.src([
            'dev/farm.js',
        ])
        .pipe(concat('farm.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("public/dist"))
        .pipe(browserSync.stream());
    
});



gulp.task('market', function() {
    
    return gulp.src([
            'dev/market.js',
        ])
        .pipe(concat('market.js'))
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
            'dev/blockchain_dev.js',
            'dev/token.js',
            //'dev/airdrop.js',
            'dev/presell.js',
            'dev/ido.js',
            //'dev/farm.js',
            'dev/admin/market.js',
            'dev/admin.js'
        ])
        .pipe(concat('web3admin.js'))
        //.pipe(uglify())
        .pipe(gulp.dest("server/public/dist"))
        .pipe(browserSync.stream());
    
});

//gulp.task('clean', () => del(['data/dev/assent/js/*.js', 'data/dev/assent/css/*.css']));

gulp.task('default', gulp.series(['blockchain','web3','web3admin','bootstrap','game','airdrop','ido','presell','farm','market'],function(done) { 
    // default task code here
    done();
}));