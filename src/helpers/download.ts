var fs = require('fs');
var path = require('path');

var AdmZip = require("adm-zip");


export function download() {
    const to_zip = fs.readdirSync(path.resolve(__dirname, "../import"));
    // creating archives
    const zp = new AdmZip();

    for (let k = 0; k < to_zip.length; k++) {
        zp.addLocalFile(path.resolve(__dirname, "../import") + "/" + to_zip[k])
    }
    // toBuffer() is used to read the data and save it
    // for downloading process!
    return zp.toBuffer();
};
