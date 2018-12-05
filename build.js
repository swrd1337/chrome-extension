var gulp = require('gulp')
require('./gulpfile');

let fs = require('fs-extra');

const CHROME = 'chrome';
const FIREFOX = 'firefox';
const TARGET = 'target';

let chromeOrFirefox = '';

if (!fs.existsSync(`/${TARGET}`)) {
    fs.mkdir(TARGET, errorHandler);
}

process.argv.forEach((val, index) => {
    if (index === 2) {
        chromeOrFirefox = val;
    }
});


if (!fs.existsSync(`${TARGET}/${chromeOrFirefox}`)) {
    fs.mkdir(`${TARGET}/${chromeOrFirefox}`, errorHandler);
}

if (chromeOrFirefox === CHROME) {
    extensionBuilder(CHROME, 'gc');
} else {
    extensionBuilder(FIREFOX, 'ff');
}

function extensionBuilder(browser, ext) {
    gulp.start(browser);
    fs.copy('images', `${TARGET}/${browser}/images`, errorHandler);
    fs.copy('styles', `${TARGET}/${browser}/styles`, errorHandler);
    fs.copySync('./popup.html', `${TARGET}/${browser}/popup.html`);
    fs.copySync(`./${ext}-manifest.json`, `./${TARGET}/${browser}/manifest.json`);
}

function errorHandler(error) {
    if (error) {
        return console.log(`${error}`);
    } 
    console.log('[COPY] - Done!');
}

