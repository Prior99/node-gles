import { promises } from "fs";
import { resolve } from "path";
import { qualifiedName, qualifiedZipName } from "../file-name";
import AdmZip from "adm-zip";

async function zip(): Promise<void> {
    const source = resolve(__dirname, "..", "..", "build", "Release", "nodejs_gl_binding.node");
    await promises.rename(source, qualifiedName);
    const zip = new AdmZip();
    zip.addLocalFile(qualifiedName);
    zip.addLocalFolder(resolve(__dirname, "..", "..", "deps"), "deps");
    await new Promise((resolve, reject) => zip.writeZip(qualifiedZipName, (err) => err ? reject(err) : resolve()));
}

zip();
