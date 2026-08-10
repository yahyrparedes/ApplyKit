import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";

const root = new URL("../..", import.meta.url).pathname;
const index = JSON.parse(await readFile(join(root, "applications/index.json"), "utf8"));
const exportScript = join(root, "generator/scripts/export-pdf.js");

for (const app of index.filter((item) => item.dataPath && item.template)) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [exportScript, "--template", app.template, "--slug", app.id, "--path", app.dataPath], {
      cwd: join(root, "generator"),
      stdio: "inherit"
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`Export failed for ${app.id}`))));
  });
}
