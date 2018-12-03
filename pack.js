let fs = require('fs-extra');
let archiver = require('archiver');

let browser;

process.argv.forEach((val, index) => {
    if (index === 2) {
        browser = val;
    }
});

let target = 'target';

if (fs.existsSync(`/${target}`)) {
    fs.mkdir(target, e => {
        if (e) {
            return console.log(e);
        }
        console.log('[DONE] ---> making dir.');
    });
}

let output = fs.createWriteStream(`${target}/${browser}.zip`);
let archive = archiver('zip', {
    zlib: {
        level: 9
    }
});

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('Packing is done.');
});

archive.on('error', function(err){
    throw err;
});

archive.pipe(output);


archive.directory(`${browser}/`, false);


archive.finalize();