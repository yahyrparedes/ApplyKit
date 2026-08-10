import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i], process.argv[i + 1]);
}

const template = args.get("--template") || "android";
const data = args.get("--data") || "android-sample";
const dataPath = args.get("--path");
const slug = args.get("--slug") || data;
const kind = args.get("--kind") || "cv";
const port = Number(process.env.PORT || 4173);
const outputDir = resolve("../output/pdf", slug);
const output = resolve(outputDir, `${kind}.pdf`);
const query = dataPath ? `path=${encodeURIComponent(dataPath)}` : `data=${encodeURIComponent(data)}`;
const templateFile = kind === "cover-letter" ? "cover-letter" : template;
const url = `http://127.0.0.1:${port}/generator/templates/${templateFile}.html?${query}&pdf=1`;

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle" });
await page.pdf({
  path: output,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" }
});
await browser.close();

console.log(output);
