let gulp = require('gulp');
let iife = require('gulp-iife');
 
const CHROME_PATH = './target/chrome/scripts';
const FIREFOX_PATH = './target/firefox/scripts';

gulp.task('ext-script', function() {
    return gulp.src('./scripts/*.js')
        .pipe(iife({
            useStrict: false,
            prependSemicolon: false,
        }))
        .pipe(gulp.dest(CHROME_PATH))
        .pipe(gulp.dest(FIREFOX_PATH));
});