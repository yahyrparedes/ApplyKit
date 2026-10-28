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
  for (const [index, link] of (data.person?.links || []).entries()) {
    if (!/^https?:\/\//.test(link?.url || "")) errors.push(`person.links[${index}].url must start with http(s)://`);
  }
  for (const [index, language] of (data.languages || []).entries()) {
    if (!language.name || !language.level) errors.push(`languages[${index}] needs name and level`);
  }
  return errors.map((error) => `${label}: ${error}`);
}

// European CV quality checks. Reported as warnings so older applications keep validating.
const DATE_RANGE = /^(\d{2}\/\d{4}|\d{4}) [-–] (\d{2}\/\d{4}|\d{4}|Actualidad|Presente|Present|Current)$/;
const CEFR = /\b(A1|A2|B1|B2|C1|C2|nativ[oa]|native|lengua materna|mother tongue)\b/i;

function cvWarnings(data, label) {
  const warnings = [];
  const jobs = [...(data.experiencePrimary || []), ...(data.experienceSecondary || [])];
  for (const job of jobs) {
    if (job.dates && !DATE_RANGE.test(job.dates.trim())) warnings.push(`"${job.company}" dates "${job.dates}" should be "MM/YYYY – MM/YYYY|Actualidad"`);
    if (!job.location) warnings.push(`"${job.company}" has no location (city, country / remote)`);
  }
  const profileLength = (data.profile || []).join(" ").length;
  if (profileLength > 520) warnings.push(`profile is ${profileLength} chars; aim for 3-4 lines (~500 chars)`);
  if (!data.languages?.length) warnings.push("no languages section (CEFR levels expected in European CVs)");
  for (const language of data.languages || []) {
    if (!CEFR.test(`${language.level}`)) warnings.push(`language "${language.name}" level should use CEFR (A1-C2) or native`);
  }
  return warnings.map((warning) => `${label}: ${warning}`);
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
const warnings = [];
for (const file of await readdir(join(root, "generator/data"))) {
  if (file.endsWith(".json") && file.includes("cover-letter")) {
    errors.push(...validateCoverLetter(await readJson(join(root, "generator/data", file)), `generator/data/${file}`));
  } else if (file.endsWith(".json") && !file.includes("applications")) {
    const data = await readJson(join(root, "generator/data", file));
    errors.push(...validateCvData(data, `generator/data/${file}`));
    warnings.push(...cvWarnings(data, `generator/data/${file}`));
  }
}

// Optional: node scripts/validate.js --app <application-id> checks one real application.
const appArg = process.argv.indexOf("--app");

try {
  const index = await readJson(join(root, "applications/index.json"));
  errors.push(...validateApplicationsIndex(index));
  if (appArg > 0) {
    const app = index.find((item) => item.id === process.argv[appArg + 1]);
    if (!app) errors.push(`Application not found: ${process.argv[appArg + 1]}`);
    else {
      const data = await readJson(join(root, app.dataPath));
      errors.push(...validateCvData(data, app.dataPath));
      warnings.push(...cvWarnings(data, app.dataPath));
    }
  }
} catch {
  // Template mode may not track a real applications index.
}

if (warnings.length) console.warn(warnings.map((warning) => `WARNING ${warning}`).join("\n"));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("ApplyKit validation passed.");
