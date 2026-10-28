const params = new URLSearchParams(window.location.search);
const dataName = params.get("data") || "cover-letter-sample";
const dataPath = params.get("path");
const sourceUrl = dataPath || `/generator/data/${dataName}.json`;
const data = await fetch(sourceUrl).then((response) => {
  if (!response.ok) throw new Error(`Cover letter data not found: ${sourceUrl}`);
  return response.json();
});

document.documentElement.lang = data.lang || "en";
document.title = `${data.person.name} - Cover letter - ${data.application.role}`;

function el(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

const root = document.querySelector("#letter");
const header = el("header", "letter-header");
header.append(el("h1", "", data.person.name));
const contactParts = [data.person.location, data.person.workPermit, data.person.email, data.person.phone]
  .concat((data.person.links || []).map((link) => link.text || link.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")))
  .filter(Boolean);
header.append(el("p", "", contactParts.join(" | ")));

const meta = el("section", "letter-meta");
meta.append(el("p", "", data.application.date));
meta.append(el("p", "", data.application.company));
meta.append(el("p", "", data.application.role));

const body = el("section", "letter-body");
body.append(el("p", "", data.greeting));
for (const paragraph of data.paragraphs || []) body.append(el("p", "", paragraph));
body.append(el("p", "", data.closing));
body.append(el("p", "signature", data.person.name));

root.append(header, meta, body);
document.body.dataset.rendered = "true";
