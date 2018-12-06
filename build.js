const gulp = require('gulp')
const fs = require('fs-extra');

require('./gulpfile');

const val = {
    CHROME : 'chrome',
    FIREFOX : 'firefox',
    TARGET : 'target' 
}

let chromeOrFirefox = '';

if (!fs.existsSync(`/${val.TARGET}`)) {
    fs.mkdir(val.TARGET, errorHandler);
}

process.argv.forEach((val, index) => {
    if (index === 2) {
        chromeOrFirefox = val;
    }
});

if (!fs.existsSync(`${val.TARGET}/${chromeOrFirefox}`)) {
    fs.mkdir(`${val.TARGET}/${chromeOrFirefox}`, errorHandler);
}

if (chromeOrFirefox === val.CHROME) {
    extensionBuilder(val.CHROME, 'gc');
} else {
    extensionBuilder(val.FIREFOX, 'ff');
}

function extensionBuilder(browser, ext) {
    gulp.start(browser);
    fs.copy('images', `${val.TARGET}/${browser}/images`, errorHandler);
    fs.copy('styles', `${val.TARGET}/${browser}/styles`, errorHandler);
    fs.copySync('./popup.html', `${val.TARGET}/${browser}/popup.html`);
    fs.copySync(`./${ext}-manifest.json`, `./${val.TARGET}/${browser}/manifest.json`);
}

function errorHandler(error) {
    if (error) {
        return console.log(`${error}`);
    } 
    console.log('[COPY] - Done!');
}

