const container = document.querySelector("#applications");
const counter = document.querySelector("#application-count");

function el(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function link(label, href) {
  if (!href) return el("span", "disabled-link", label);
  const node = el("a", "", label);
  node.href = href;
  return node;
}

async function loadApplications() {
  const primary = await fetch("/applications/index.json");
  if (primary.ok) return primary.json();
  const fallback = await fetch("/generator/data/applications-sample.json");
  if (fallback.ok) return fallback.json();
  throw new Error("No applications index or sample data found.");
}

const applications = await loadApplications();

counter.textContent = `${applications.length} total`;

for (const item of applications) {
  const card = el("article", "application-card");
  const head = el("div", "application-head");
  const title = el("div", "");
  title.append(el("h3", "", item.role));
  title.append(el("p", "", `${item.company} - ${item.location}`));
  const status = el("span", `status status-${item.status}`, item.status);
  head.append(title, status);

  const meta = el("dl", "application-meta");
  const rows = [
    ["Role family", item.roleFamily],
    ["Work mode", item.workMode],
    ["Created", item.createdAt],
    ["Updated", item.updatedAt],
    ["Template", item.template]
  ];
  for (const [labelText, value] of rows) {
    meta.append(el("dt", "", labelText), el("dd", "", value || "-"));
  }

  const actions = el("div", "application-actions");
  actions.append(
    link("Preview", item.previewUrl),
    link("PDF", item.pdfPath),
    link("Notes", item.notesPath),
    link("Data", item.dataPath)
  );

  card.append(head, meta, actions);
  container.append(card);
}
