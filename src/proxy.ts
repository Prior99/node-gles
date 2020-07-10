import { HttpsProxyAgent } from "https-proxy-agent";
import { RequestInit } from "node-fetch";

const proxy =
    process.env["HTTPS_PROXY"] ?? process.env["https_proxy"] ?? process.env["HTTP_PROXY"] ?? process.env["http_proxy"];

export const options: RequestInit = {
    agent: proxy ? (new HttpsProxyAgent(proxy) as any) : undefined, // eslint-disable-line
};
