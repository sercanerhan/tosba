import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { brotliCompress } from "node:zlib";
import { promisify } from "node:util";

const compress = promisify(brotliCompress);
const root = resolve(process.cwd(), "dist");
const port = Number(process.env.PORT ?? "4323");
const host = process.env.HOST ?? "127.0.0.1";
const compressible = new Set([".css", ".html", ".js", ".json", ".svg", ".txt", ".xml"]);
const contentTypes: Record<string, string> = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};
const compressedCache = new Map<string, Uint8Array>();

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", `http://${host}`).pathname);
    const requested = pathname.endsWith("/") ? `${pathname}index.html` : pathname;
    const file = resolve(root, `.${requested}`);

    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const info = await stat(file);
    if (!info.isFile()) throw new Error("not a file");
    const extension = extname(file).toLowerCase();
    const headers: Record<string, string> = {
      "Content-Type": contentTypes[extension] ?? "application/octet-stream",
      "Cache-Control": pathname.startsWith("/_astro/") ? "public, max-age=31536000, immutable" : "no-cache",
      "Vary": "Accept-Encoding",
    };
    let body: Uint8Array = await readFile(file);

    if (compressible.has(extension) && request.headers["accept-encoding"]?.includes("br")) {
      const cached = compressedCache.get(file);
      body = cached ?? await compress(body);
      compressedCache.set(file, body);
      headers["Content-Encoding"] = "br";
    }

    response.writeHead(200, headers).end(request.method === "HEAD" ? undefined : body);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not found");
  }
}).listen(port, host, () => {
  console.log(`Üretim önizlemesi http://${host}:${port}/ adresinde hazır.`);
});
