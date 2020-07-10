const { resolve } = require("path");

const suffix = `${process.platform}-${process.arch}-${process.versions.modules}`;
const baseName = `node-gles-${suffix}.node`;
const zipName= `node-gles-${suffix}.zip`;
const qualifiedName = resolve(__dirname, "..", baseName);
const qualifiedZipName = resolve(__dirname, "..", zipName);

module.exports = { suffix, baseName, zipName, qualifiedName, qualifiedZipName };