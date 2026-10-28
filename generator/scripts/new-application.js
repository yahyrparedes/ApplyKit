import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../..", import.meta.url).pathname;
const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) args.set(process.argv[i], process.argv[i + 1]);

const roleFamily = args.get("--role") || "android";
const company = args.get("--company") || "example-company";
const title = args.get("--title") || "example-role";
const template = args.get("--template") || roleFamily;
const slug = args.get("--slug") || `${company}-${title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const location = args.get("--location") || "";
const workMode = args.get("--work-mode") || "";
const today = new Date().toISOString().slice(0, 10);
const appDir = join(root, "applications", roleFamily, slug);
const appDataPath = `/applications/${roleFamily}/${slug}/cv-data.json`;
const appNotesPath = `/applications/${roleFamily}/${slug}/notes.md`;
const sampleName = template === "backend" ? "backend-sample.json" : template === "fullstack" ? "fullstack-sample.json" : "android-sample.json";

await mkdir(appDir, { recursive: true });
const sample = await readFile(join(root, "generator/data", sampleName), "utf8");
await writeFile(join(appDir, "cv-data.json"), sample);
await writeFile(join(appDir, "notes.md"), `# ${company} - ${title}\n\nStatus: lead\nCreated: ${today}\nTemplate: ${template}\n\n## Strategy\n\n- TODO: summarize positioning for this role.\n- TODO: list keywords from the job description.\n- TODO: note risks or experience gaps honestly.\n`);

const indexPath = join(root, "applications/index.json");
let index = [];
try {
  index = JSON.parse(await readFile(indexPath, "utf8"));
} catch {
  index = [];
}

const entry = {
  id: slug,
  company,
  role: title,
  roleFamily,
  location,
  workMode,
  status: "lead",
  createdAt: today,
  updatedAt: today,
  template,
  dataPath: appDataPath,
  previewUrl: `/generator/templates/${template}.html?path=${appDataPath}`,
  pdfPath: null,
  notesPath: appNotesPath
};

const existingIndex = index.findIndex((item) => item.id === slug);
if (existingIndex >= 0) index[existingIndex] = entry;
else index.push(entry);
await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`);

console.log(`Created applications/${roleFamily}/${slug}`);
console.log(`Preview: ${entry.previewUrl}`);
