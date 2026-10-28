import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const root = new URL("../..", import.meta.url).pathname;
const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i], process.argv[i + 1]);
}

const template = args.get("--template") || "android";
const dataName = args.get("--data") || "android-sample";
const dataPath = args.get("--path");
const slug = args.get("--slug") || dataName;
const kind = args.get("--kind") || "cv";
const port = Number(process.env.PORT || 4173);
const maxPages = Number(args.get("--max-pages") || 2);

const dataFile = dataPath ? join(root, dataPath) : join(root, "generator/data", `${dataName}.json`);
const data = JSON.parse(await readFile(dataFile, "utf8"));

function fileSafe(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// "Nombre Segundo Apellido1 Apellido2" -> "Nombre Apellido1"; shorter names are kept as-is.
function shortName(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 4) return `${parts[0]} ${parts[2]}`;
  if (parts.length === 3) return `${parts[0]} ${parts[1]}`;
  return parts.join(" ");
}

// Recruiters download many "cv.pdf" files: name the export after the candidate and the target role.
function outputFileName() {
  if (args.get("--file-name")) return args.get("--file-name");
  if (data.output?.fileName) return data.output.fileName;
  const person = fileSafe(data.person?.shortName || shortName(data.person?.name) || "Candidate");
  const titleRole = data.target?.title?.split("|")[0];
  const role = fileSafe(data.output?.fileRole || data.target?.fileRole || titleRole || data.application?.role || slug);
  const label = kind === "cover-letter" ? data.output?.coverLetterLabel || "Cover-Letter" : data.output?.cvLabel || "CV";
  return `${person}-${label}-${role}.pdf`;
}

const fileName = outputFileName().endsWith(".pdf") ? outputFileName() : `${outputFileName()}.pdf`;
const outputDir = resolve(root, "output/pdf", slug);
const output = resolve(outputDir, fileName);
const query = dataPath ? `path=${encodeURIComponent(dataPath)}` : `data=${encodeURIComponent(dataName)}`;
const templateFile = kind === "cover-letter" ? "cover-letter" : template;
const url = `http://127.0.0.1:${port}/generator/templates/${templateFile}.html?${query}&pdf=1`;

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1240, height: 1754 }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle" });
await page.pdf({
  path: output,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" }
});

// Estimate how full the last page is by laying the document out at printable A4 width.
const mmToPx = 96 / 25.4;
await page.emulateMedia({ media: "print" });
await page.setViewportSize({ width: Math.round(186 * mmToPx), height: 1754 });
const contentHeight = await page.evaluate(() => {
  const node = document.querySelector("#cv, #letter");
  return node ? node.getBoundingClientRect().height : document.body.scrollHeight;
});
await browser.close();

const pdfBytes = await readFile(output, "latin1");
const pages = (pdfBytes.match(/\/Type\s*\/Page(?!s)/g) || []).length;
const printableHeight = 277 * mmToPx;
// Estimated content pages minus the full pages before the last one; clamped because print page breaks add gaps.
const lastPageFill = Math.min(1, Math.max(0.02, contentHeight / printableHeight - (pages - 1)));

console.log(output);
console.log(`Pages: ${pages} | last page filled ~${Math.round(lastPageFill * 100)}%`);

const warnings = [];
if (kind === "cv" && pages > maxPages) warnings.push(`CV has ${pages} pages (max ${maxPages}). Trim profile, older roles or skills.`);
if (kind === "cv" && pages > 1 && lastPageFill < 0.5) warnings.push("Last page is less than half full. Trim to fewer pages or strengthen relevant content.");
if (kind === "cover-letter" && pages > 1) warnings.push("Cover letter should fit on one page.");
for (const warning of warnings) console.warn(`WARNING: ${warning}`);

// Keep the dashboard link pointing at the latest export.
const indexPath = join(root, "applications/index.json");
try {
  const index = JSON.parse(await readFile(indexPath, "utf8"));
  const entry = index.find((item) => item.id === slug);
  if (entry) {
    const publicPath = `/output/pdf/${slug}/${fileName}`;
    if (kind === "cover-letter") entry.coverLetterPdfPath = publicPath;
    else entry.pdfPath = publicPath;
    entry.updatedAt = new Date().toISOString().slice(0, 10);
    await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`);
  }
} catch {
  // Template mode may not track a real applications index.
}
