const { promises, existsSync } = require("fs");
const { join } = require("path");
const tar = require("tar");
const os = require("os");
const fetch = require("node-fetch");
const AdmZip = require("adm-zip");
const { PassThrough } = require("stream");
const { options } = require("./proxy");

const platform = os.platform().toLowerCase();
const depsPath = join(__dirname, "..", "deps");
const anglePath = join(depsPath, "angle", "out", "Release");

function getAngleDownloadUrl() {
    const platformArch = `${platform}-${os.arch().toLowerCase()}`;
    const baseUrl = "https://storage.googleapis.com/angle-builds";
    switch (platform) {
        case "darwin":
            return `${baseUrl}/angle-3729-${platformArch}.tar.gz`;
        case "linux":
            return `${baseUrl}/angle-3729-${platformArch}.tar.gz`;
        case "win32":
            return `${baseUrl}/angle-3729-${platformArch}.zip`;
        default:
            throw new Error(`The platform ${platformArch} is not currently supported!`);
    }
}

async function extractWindows(buffer) {
    const zip = new AdmZip(buffer);
    await new Promise((resolve, reject) =>
        zip.extractAllToAsync(depsPath, true, (err) => (err ? reject(err) : resolve())),
    );

    // The .lib files for the two .dll files we care about have a name the compiler doesn't like:
    await promises.rename(join(anglePath, "libGLESv2.dll.lib"), join(anglePath, "libGLESv2.lib"));
    await promises.rename(join(anglePath, "libEGL.dll.lib"), join(anglePath, "libEGL.lib"));
}

function extractLinux(buffer) {
    return new Promise((resolve, reject) => {
        const extract = tar.extract({ cwd: depsPath, strict: true });
        const stream = new PassThrough();
        extract.once("close", () => resolve());
        extract.once("error", (err) => reject(err));
        stream.end(buffer);
        stream.pipe(extract);
    });
}

async function downloadAngleLibs() {
    const downloadUrl = getAngleDownloadUrl();
    console.log(`Downloading ANGLE from: ${downloadUrl}`);

    const request = await fetch(downloadUrl, options);
    if (!request.ok) {
        if (request.status === 404) {
            throw new Error(
                `Not found: ${downloadUrl}).`,
            );
        } else {
            throw new Error(
                `Error downloading ANGLE build. Received status code ${request.status}`,
            );
        }
    }
    const buffer = await request.buffer();
    if (!existsSync(depsPath)) {
        await promises.mkdir(depsPath);
    }
    if (platform === "win32") {
        await extractWindows(buffer);
    } else {
        await extractLinux(buffer);
    }
}

downloadAngleLibs();