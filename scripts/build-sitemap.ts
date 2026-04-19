import { mkdirSync, readdirSync, renameSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { questionnaireSEO, baseSEO } from "../src/lib/seo-config";

const distDir = resolve(process.cwd(), "dist");
mkdirSync(distDir, { recursive: true });

for (const entry of readdirSync(distDir)) {
  const filePath = resolve(distDir, entry);
  if (!statSync(filePath).isFile() || !entry.endsWith(".html")) {
    continue;
  }

  if (entry === "index.html" || entry === "404.html") {
    continue;
  }

  if (entry === "404.html.html") {
    renameSync(filePath, resolve(distDir, "404.html"));
    continue;
  }

  const slug = entry.slice(0, -".html".length);
  const routeDir = resolve(distDir, slug);
  mkdirSync(routeDir, { recursive: true });
  renameSync(filePath, resolve(routeDir, "index.html"));
}

const questionnairePaths = Object.keys(questionnaireSEO).sort();
const urls = [
  `${baseSEO.siteUrl}/`,
  ...questionnairePaths.map((path) => `${baseSEO.siteUrl}/${path}/`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${baseSEO.siteUrl}/sitemap.xml
`;

writeFileSync(resolve(distDir, "sitemap.xml"), xml, "utf8");
writeFileSync(resolve(distDir, "robots.txt"), robots, "utf8");

console.log(`Wrote sitemap.xml (${urls.length} urls) and robots.txt to dist/`);
