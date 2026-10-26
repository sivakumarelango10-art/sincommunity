// Injects the server-rendered page into dist/index.html so the logo, headings and all
// narrative text exist in the delivered HTML before any JavaScript runs.
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const template = await readFile(path.join(root, "dist", "index.html"), "utf8");
const { render } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);
const html = template.replace("<!--app-html-->", render());
if (html === template) throw new Error("prerender marker <!--app-html--> not found");
await writeFile(path.join(root, "dist", "index.html"), html);
await rm(path.join(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerendered dist/index.html (${(html.length / 1024).toFixed(1)} kB)`);
