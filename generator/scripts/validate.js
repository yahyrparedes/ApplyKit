import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("../..", import.meta.url).pathname;

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function requireString(object, path, errors) {
  const value = path.split(".").reduce((acc, key) => acc?.[key], object);
  if (typeof value !== "string" || value.trim() === "") errors.push(`Missing string: ${path}`);
}

function requireArray(object, path, errors) {
  const value = path.split(".").reduce((acc, key) => acc?.[key], object);
  if (!Array.isArray(value)) errors.push(`Missing array: ${path}`);
}

function validateCvData(data, label) {
  const errors = [];
  ["person.name", "person.location", "person.email", "person.phone", "person.availability", "target.title", "target.roleLabel"].forEach((path) => requireString(data, path, errors));
  ["profile", "skills", "experiencePrimary", "education", "training", "alignment"].forEach((path) => requireArray(data, path, errors));
  for (const [index, skill] of (data.skills || []).entries()) {
    if (!skill.name) errors.push(`skills[${index}].name missing`);
    if (!Array.isArray(skill.items)) errors.push(`skills[${index}].items missing`);
  }
  for (const [index, job] of (data.experiencePrimary || []).entries()) {
    ["company", "role", "dates"].forEach((key) => {
      if (!job[key]) errors.push(`experiencePrimary[${index}].${key} missing`);
    });
    if (!Array.isArray(job.highlights)) errors.push(`experiencePrimary[${index}].highlights missing`);
  }
  return errors.map((error) => `${label}: ${error}`);
}

function validateApplicationsIndex(index) {
  const errors = [];
  const seen = new Set();
  for (const [position, item] of index.entries()) {
    ["id", "company", "role", "roleFamily", "status", "template"].forEach((key) => {
      if (!item[key]) errors.push(`applications[${position}].${key} missing`);
    });
    if (seen.has(item.id)) errors.push(`Duplicate application id: ${item.id}`);
    seen.add(item.id);
  }
  return errors;
}

function validateCoverLetter(data, label) {
  const errors = [];
  ["person.name", "person.email", "person.phone", "person.location", "application.company", "application.role", "application.date", "greeting", "closing"].forEach((path) => requireString(data, path, errors));
  requireArray(data, "paragraphs", errors);
  return errors.map((error) => `${label}: ${error}`);
}

const errors = [];
for (const file of await readdir(join(root, "generator/data"))) {
  if (file.endsWith(".json") && file.includes("cover-letter")) {
    errors.push(...validateCoverLetter(await readJson(join(root, "generator/data", file)), `generator/data/${file}`));
  } else if (file.endsWith(".json") && !file.includes("applications")) {
    errors.push(...validateCvData(await readJson(join(root, "generator/data", file)), `generator/data/${file}`));
  }
}

try {
  const index = await readJson(join(root, "applications/index.json"));
  errors.push(...validateApplicationsIndex(index));
} catch {
  // Template mode may not track a real applications index.
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("ApplyKit validation passed.");
