import { resolve } from "path";

export const suffix = `${process.platform}-${process.arch}-${process.versions.modules}`;
export const baseName = `node-gles-${suffix}.node`;
export const zipName= `node-gles-${suffix}.zip`;
export const qualifiedName = resolve(__dirname, "..", baseName);
export const qualifiedZipName = resolve(__dirname, "..", zipName);
