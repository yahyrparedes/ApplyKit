const params = new URLSearchParams(window.location.search);
const dataName = params.get("data") || "android-sample";
const dataPath = params.get("path");
const templateName = document.documentElement.dataset.template || "android";

const sourceUrl = dataPath || `/generator/data/${dataName}.json`;
const data = await fetch(sourceUrl).then((response) => {
  if (!response.ok) throw new Error(`Data file not found: ${sourceUrl}`);
  return response.json();
});

document.title = `${data.person.name} - ${data.target.title}`;
document.body.classList.add(`role-${templateName}`);

const bySection = (name) => document.querySelector(`[data-section="${name}"]`);
const text = (value) => value ?? "";

function el(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
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

function renderHeader() {
  const section = bySection("header");
  const h1 = el("h1", "", data.person.name);
  const target = el("p", "target", data.target.title);
  const meta = el("p", "meta-line", data.person.location);
  const contact = el("p", "contact-line", `${data.person.email} | ${data.person.phone}`);
  const availability = el("p", "availability", data.person.availability);
  section.append(h1, target, meta, contact, availability);
}

function renderProfile() {
  const section = bySection("profile");
  title(section, data.labels?.profile || "Professional profile");
  for (const paragraph of data.profile || []) section.append(el("p", "", paragraph));
}

function renderSkills() {
  const section = bySection("skills");
  title(section, data.labels?.skills || "Core skills", data.target.roleLabel);
  const grid = el("div", "skills-grid");
  for (const group of data.skills || []) {
    const block = el("article", "skill-group");
    block.append(el("h3", "", group.name));
    block.append(el("p", "", group.items.join(", ")));
    grid.append(block);
  }
  section.append(grid);
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
    head.append(el("p", "dates", job.dates));
    article.append(head);
    if (job.stack) article.append(el("p", "stack", `Stack: ${job.stack}`));
    article.append(list(job.highlights));
    section.append(article);
  }
}

function renderEducationTraining() {
  const section = bySection("education-training");
  title(section, data.labels?.educationTraining || "Education and training");
  const columns = el("div", "two-columns");
  const education = el("article", "");
  education.append(el("h3", "", data.labels?.education || "Education"));
  for (const item of data.education || []) {
    const p = el("p", "compact-line");
    p.innerHTML = `<strong>${item.name}</strong><br>${item.detail}`;
    education.append(p);
  }
  const training = el("article", "");
  training.append(el("h3", "", data.labels?.training || "Training"));
  training.append(list(data.training || [], "plain-list"));
  columns.append(education, training);
  section.append(columns);
}

function renderAlignment() {
  const section = bySection("alignment");
  title(section, data.labels?.alignment || "Role alignment");
  const tags = el("div", "tag-list");
  for (const keyword of data.alignment || []) tags.append(el("span", "tag", keyword));
  section.append(tags);
}

renderHeader();
renderProfile();
renderSkills();
renderExperience("experience-primary", data.labels?.experiencePrimary || "Relevant experience", data.experiencePrimary);
renderExperience("experience-secondary", data.labels?.experienceSecondary || "Additional experience", data.experienceSecondary);
renderEducationTraining();
renderAlignment();
