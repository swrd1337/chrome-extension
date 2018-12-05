let gulp = require('gulp');
let iife = require('gulp-iife');

gulp.task('chrome', function() {
    return gulpScripts('./target/chrome/scripts');
});

gulp.task('firefox', function() {
    return gulpScripts('./target/firefox/scripts');
});

function gulpScripts(path) {
    return gulp.src('./scripts/*.js')
        .pipe(iife({
            useStrict: false,
            prependSemicolon: false,
        }))
        .pipe(gulp.dest(path));
}