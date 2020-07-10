const { HttpsProxyAgent } = require("https-proxy-agent");

const proxy =
    process.env["HTTPS_PROXY"] || process.env["https_proxy"] || process.env["HTTP_PROXY"] || process.env["http_proxy"];

const options = {
    agent: proxy ? (new HttpsProxyAgent(proxy)) : undefined, // eslint-disable-line
};

module.exports = { options };
