// Build-time prerender: writes every public page as its own HTML file (with its own title,
// description, canonical link, social tags and structured data), plus sitemap.xml and robots.txt.
// The logo, headings and all text are in the delivered HTML before any JavaScript runs.
import { readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = (f) => path.join(root, "dist", f);
const template = await readFile(dist("index.html"), "utf8");
if (!template.includes("<!--app-html-->") || !template.includes("<!--head-tags-->") || !template.includes("<!--app-path-->")) throw new Error("prerender markers not found in dist/index.html");

const { render, ROUTES, headTags, SITE_URL } = await import(pathToFileURL(path.join(root, "dist-ssr", "entry-server.js")).href);

for (const route of ROUTES) {
  // data-path records which page this file is, so the browser renders the same page it was sent
  // (the 404 page is served at any unknown address)
  const html = template.replace("<!--head-tags-->", headTags(route)).replace("<!--app-path-->", route.path).replace("<!--app-html-->", render(route.path));
  await writeFile(dist(route.file), html);
  console.log(`prerendered dist/${route.file} (${(html.length / 1024).toFixed(1)} kB)`);
}

// sitemap: public, indexable pages only, on the production address
const today = new Date().toISOString().slice(0, 10);
const urls = ROUTES.filter((r) => r.indexable).map((r) => [
  "  <url>",
  `    <loc>${SITE_URL}${r.path === "/" ? "/" : r.path}</loc>`,
  `    <lastmod>${today}</lastmod>`,
  r.changefreq ? `    <changefreq>${r.changefreq}</changefreq>` : null,
  r.priority != null ? `    <priority>${r.priority.toFixed(1)}</priority>` : null,
  "  </url>",
].filter(Boolean).join("\n"));
await writeFile(dist("sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
await writeFile(dist("robots.txt"), `# Everything on this site is public, including the CSS, JavaScript and images Google needs to render it.\nUser-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`wrote sitemap.xml (${urls.length} pages) and robots.txt`);

await rm(path.join(root, "dist-ssr"), { recursive: true, force: true });
