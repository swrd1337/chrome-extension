let gulp = require('gulp');
let iife = require('gulp-iife');
 
const CHROME_PATH = './target/chrome/scripts';
const FIREFOX_PATH = './target/firefox/scripts';

gulp.task('chrome', function() {
    return gulpScripts(CHROME_PATH);
});

gulp.task('firefox', function() {
    return gulpScripts(FIREFOX_PATH);
});

function gulpScripts(path) {
    return gulp.src('./scripts/*.js')
        .pipe(iife({
            useStrict: false,
            prependSemicolon: false,
        }))
        .pipe(gulp.dest(path));
}