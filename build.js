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

if (chromeOrFirefox === CHROME) {
    extensionBuilder(CHROME, 'gc');
} else {
    extensionBuilder(FIREFOX, 'ff');
}

if (!fs.existsSync(`${TARGET}/${chromeOrFirefox}`)) {
    fs.mkdir(`${TARGET}/${chromeOrFirefox}`, errorHandler);
}

function extensionBuilder(path, ext) {
    fs.copy('scripts', `${TARGET}/${path}/scripts`, errorHandler);
    fs.copy('images', `${TARGET}/${path}/images`, errorHandler);
    fs.copy('styles', `${TARGET}/${path}/styles`, errorHandler);
    fs.copySync('./popup.html', `${TARGET}/${path}/popup.html`);
    fs.copySync(`./${ext}-manifest.json`, `./${TARGET}/${path}/manifest.json`);
}

function errorHandler(error) {
    if (error) {
        if (error.code === 'EEXIST') {
            return console.log(`${error}`);
        }
        return console.log(`Failed to create directory: ${error}`);
    } 
    console.log('[COPY] ---> Done!');
}
