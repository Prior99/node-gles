import { join } from "path";
import { baseName } from "../file-name";
import fetch from "node-fetch";
import { promises, existsSync } from "fs";
import { options } from "../proxy";
import AdmZip from "adm-zip";
import { qualifiedName } from "../file-name";

async function downloadBundle(): Promise<void> {
    const { version, repository } = JSON.parse(await promises.readFile(join(__dirname, "..", "..", "package.json"), "utf8"));
    if (existsSync(qualifiedName)) {
        return;
    }
    if (
        process.env["NODE_GLES_SKIP_BINARY_DOWNLOAD_FOR_CI"] ||
        process.env["npm_config_node_gles_skip_binary_download_for_ci"]
    ) {
        return;
    }

    // Get the version of the library;
    const baseUrl =
        process.env["NODE_GLES_BINARY_URL"] ||
        process.env["npm_config_node_gles_binary_url"] ||
        `${repository.url}/releases/download`;
    const url = `${baseUrl}/v${version}/${baseName}`;

    console.info(`Downloading node-gles prebuilt binary from "${url}".`);

    const request = await fetch(url, options);
    if (!request.ok) {
        if (request.status === 404) {
            throw new Error(
                `No supported node-gles ${version} build found for node ${process.version} on ${process.platform} (${process.arch}).`,
            );
        } else {
            throw new Error(
                `Error downloading binaries for node-gles ${version}. Received status code ${request.status}`,
            );
        }
    }
    const buffer = await request.buffer();
    const zip = new AdmZip(buffer);
    await new Promise((resolve, reject) =>
        zip.extractAllToAsync(join(__dirname, "..", ".."), true, (err) => (err ? reject(err) : resolve())),
    );
}

downloadBundle();