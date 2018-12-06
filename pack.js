const fs = require('fs-extra');
const archiver = require('archiver');

let browser;

process.argv.forEach((val, index) => {
    if (index === 2) {
        browser = val;
    }
});

let output = fs.createWriteStream(`target/${browser}.zip`);

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
archive.directory(`target/${browser}/`, false);
archive.finalize();