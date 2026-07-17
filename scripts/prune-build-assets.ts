import { readdir, readFile, stat, unlink } from "node:fs/promises";
import { extname, join } from "node:path";

const outputDir = new URL("../dist/", import.meta.url);
const assetDir = new URL("./_astro/", outputDir);
const textExtensions = new Set([".css", ".html", ".js", ".json", ".map", ".txt", ".xml"]);
const imageExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);

async function listFiles(directory: URL): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = new URL(entry.name, directory);
    return entry.isDirectory() ? listFiles(new URL(`${path.href}/`)) : [path.pathname];
  }));
  return files.flat();
}

const files = await listFiles(outputDir);
const textFiles = files.filter((file) => textExtensions.has(extname(file)));
const references = (await Promise.all(textFiles.map((file) => readFile(file, "utf8")))).join("\n");
const candidates = (await readdir(assetDir)).filter((file) => imageExtensions.has(extname(file)));

let removedBytes = 0;
let removedCount = 0;

for (const filename of candidates) {
  if (references.includes(filename)) continue;
  const path = join(assetDir.pathname, filename);
  removedBytes += (await stat(path)).size;
  await unlink(path);
  removedCount += 1;
}

const megabytes = (removedBytes / 1024 / 1024).toFixed(1);
console.log(`Yayın çıktısından ${removedCount} kullanılmayan görsel (${megabytes} MB) temizlendi.`);
