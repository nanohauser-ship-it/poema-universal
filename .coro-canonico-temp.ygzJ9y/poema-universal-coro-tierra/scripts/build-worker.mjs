import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";

const root = process.cwd();
const [htmlTemplate, rawCss, clientJs, handlerTemplate] = await Promise.all([
  readFile(`${root}/worker-site/index.html`, "utf8"),
  readFile(`${root}/app/globals.css`, "utf8"),
  readFile(`${root}/worker-site/client.js`, "utf8"),
  readFile(`${root}/worker-site/handler.template.js`, "utf8"),
]);

const css = rawCss.replace(/^@import\s+"tailwindcss";\s*/m, "") + "\n[hidden]{display:none!important}";
const html = htmlTemplate.replace("__SITE_CSS__", css).replace("__SITE_JS__", clientJs);
const worker = handlerTemplate.replace("__SITE_HTML__", JSON.stringify(html));

await rm(`${root}/dist`, { recursive: true, force: true });
await mkdir(`${root}/dist/server`, { recursive: true });
await mkdir(`${root}/dist/.openai`, { recursive: true });
await writeFile(`${root}/dist/server/index.js`, worker, "utf8");
await cp(`${root}/.openai/hosting.json`, `${root}/dist/.openai/hosting.json`);
await cp(`${root}/drizzle`, `${root}/dist/.openai/drizzle`, { recursive: true });
