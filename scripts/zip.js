const { promises } = require("fs");
const { resolve } = require("path");
const { qualifiedName, qualifiedZipName } = require("../src/file-name");
const AdmZip = require("adm-zip");

async function zip() {
    const source = resolve(__dirname, "..", "build", "Release", "nodejs_gl_binding.node");
    await promises.rename(source, qualifiedName);
    const zip = new AdmZip();
    zip.addLocalFile(qualifiedName);
    zip.addLocalFolder(resolve(__dirname, "..", "deps"), "deps");
    await new Promise((resolve, reject) => zip.writeZip(qualifiedZipName, (err) => err ? reject(err) : resolve()));
}

zip();
