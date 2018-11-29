let fs = require('fs-extra');

const CHROME = 'chrome';
const FIREFOX = 'firefox';

let chromeOrFirefox = '';

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

if (fs.existsSync(`/${chromeOrFirefox}`)) {
    fs.mkdir(chromeOrFirefox, errorHandler);
}

function extensionBuilder(path, ext) {
    fs.copy('scripts', `${path}/scripts`, errorHandler);
    fs.copy('images', `${path}/images`, errorHandler);
    fs.copy('styles', `${path}/styles`, errorHandler);
    fs.copySync('./popup.html', `${path}/popup.html`);
    fs.copySync(`./${ext}-manifest.json`, `./${path}/manifest.json`);
}

function errorHandler(error) {
    if (error) {
        return console.log(`[ERROR] ---> ${error}`);
    } 
    console.log('[COPY] ---> Done!');
}
