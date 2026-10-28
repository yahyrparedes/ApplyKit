const params = new URLSearchParams(window.location.search);
const dataName = params.get("data") || "android-sample";
const dataPath = params.get("path");
const isPdf = params.get("pdf") === "1";
const templateName = document.documentElement.dataset.template || "android";

const sourceUrl = dataPath || `/generator/data/${dataName}.json`;
const data = await fetch(sourceUrl).then((response) => {
  if (!response.ok) throw new Error(`Data file not found: ${sourceUrl}`);
  return response.json();
});

document.title = `${data.person.name} - ${data.target.title}`;
document.documentElement.lang = data.lang || document.documentElement.lang || "es";
document.body.classList.add(`role-${templateName}`);
if (isPdf) document.body.classList.add("pdf-mode");

const main = document.querySelector("#cv");

function bySection(name) {
  let section = document.querySelector(`[data-section="${name}"]`);
  if (!section) {
    // Older templates may not declare newer sections; create them before the alignment block.
    section = el("section", "section");
    section.dataset.section = name;
    const anchor = document.querySelector('[data-section="alignment"]');
    if (anchor) main.insertBefore(section, anchor);
    else main.append(section);
  }
  return section;
}

function el(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function joinParts(parts, separator = " · ") {
  return parts.filter((part) => typeof part === "string" && part.trim() !== "").join(separator);
}

function title(section, label, note) {
  const wrap = el("div", "section-title");
  wrap.append(el("h2", "", label));
  if (note) wrap.append(el("span", "", note));
  section.append(wrap);
}

function list(items, className = "bullets") {
  const ul = el("ul", className);
  for (const item of items || []) ul.append(el("li", "", item));
  return ul;
}

function displayUrl(url) {
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "");
}

function renderHeader() {
  const section = bySection("header");
  const { person } = data;
  if (person.photo) {
    // Optional photo (some Spanish offers require it). Omit person.photo to keep the European no-photo default.
    const img = el("img", "photo");
    img.src = person.photo;
    img.alt = person.name;
    section.classList.add("has-photo");
    section.append(img);
  }
  section.append(el("h1", "", person.name));
  section.append(el("p", "target", data.target.title));

  const meta = joinParts([person.location, person.workPermit]);
  if (meta) section.append(el("p", "meta-line", meta));

  const appendJoined = (line, nodes) => {
    nodes.forEach((node, index) => {
      if (index > 0) line.append(document.createTextNode(" | "));
      line.append(node);
    });
    if (nodes.length) section.append(line);
  };
  appendJoined(el("p", "contact-line"), [person.email, person.phone].filter(Boolean).map((value) => el("span", "", value)));
  // Links get their own line so long URLs never wrap mid-contact.
  const links = (person.links || []).filter((link) => link?.url).map((link) => {
    const anchor = el("a", "", link.text || displayUrl(link.url));
    anchor.href = link.url;
    return anchor;
  });
  appendJoined(el("p", "contact-line links-line"), links);

  if (person.availability) section.append(el("p", "availability", person.availability));
}

function renderProfile() {
  const section = bySection("profile");
  title(section, data.labels?.profile || "Professional profile");
  for (const paragraph of data.profile || []) section.append(el("p", "", paragraph));
}

function renderSkills() {
  const section = bySection("skills");
  title(section, data.labels?.skills || "Core skills", data.target.roleLabel);
  const wrap = el("div", "skills-list");
  for (const group of data.skills || []) {
    const line = el("p", "skill-line");
    line.append(el("strong", "", `${group.name}: `));
    line.append(document.createTextNode(group.items.join(", ")));
    wrap.append(line);
  }
  section.append(wrap);
}

function renderExperience(sectionName, label, entries) {
  const section = bySection(sectionName);
  if (!entries?.length) {
    section.remove();
    return;
  }
  title(section, label);
  for (const job of entries) {
    const article = el("article", "job");
    const head = el("div", "job-head");
    head.append(el("h3", "", `${job.company} - ${job.role}`));
    head.append(el("p", "dates", joinParts([job.dates, job.location])));
    article.append(head);
    if (job.summary) article.append(el("p", "job-summary", job.summary));
    if (job.stack) article.append(el("p", "stack", `${data.labels?.stack || "Stack"}: ${job.stack}`));
    if (job.highlights?.length) article.append(list(job.highlights));
    section.append(article);
  }
}

function renderEducationTraining() {
  const section = bySection("education-training");
  title(section, data.labels?.educationTraining || "Education and training");
  for (const item of data.education || []) {
    const p = el("p", "compact-line");
    p.append(el("strong", "", item.name));
    if (item.detail) p.append(document.createTextNode(` · ${item.detail}`));
    section.append(p);
  }
  if (data.training?.length) {
    section.append(el("h3", "subheading", data.labels?.training || "Training"));
    section.append(list(data.training, "bullets"));
  }
}

function renderLanguages() {
  if (!data.languages?.length) {
    document.querySelector('[data-section="languages"]')?.remove();
    return;
  }
  const section = bySection("languages");
  title(section, data.labels?.languages || "Languages");
  for (const language of data.languages) {
    const p = el("p", "compact-line");
    p.append(el("strong", "", `${language.name}: `));
    p.append(document.createTextNode(joinParts([language.level, language.detail])));
    section.append(p);
  }
}

function renderAlignment() {
  const section = bySection("alignment");
  // Internal ATS keyword checklist: visible in the HTML preview only, never in the exported PDF.
  if (!data.alignment?.length || isPdf) {
    section.remove();
    return;
  }
  section.classList.add("internal-only");
  title(section, data.labels?.alignment || "Role alignment", "Internal · not printed");
  const tags = el("div", "tag-list");
  for (const keyword of data.alignment) tags.append(el("span", "tag", keyword));
  section.append(tags);
}

renderHeader();
renderProfile();
renderSkills();
renderExperience("experience-primary", data.labels?.experiencePrimary || "Relevant experience", data.experiencePrimary);
renderExperience("experience-secondary", data.labels?.experienceSecondary || "Additional experience", data.experienceSecondary);
renderEducationTraining();
renderLanguages();
renderAlignment();
document.body.dataset.rendered = "true";
