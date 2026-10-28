# Templates

ApplyKit includes four template types.

## European CV conventions (all templates)

- A4, 10pt body text, single-column sections so ATS parsers read content in order.
- No photo, date of birth, ID number or full address.
- Header: location and optional `person.workPermit`, then email, phone and `person.links` (LinkedIn, GitHub, portfolio).
- Experience dates as `MM/YYYY – MM/YYYY` or `MM/YYYY – Present/Actualidad`, plus `location` (city, country / remote).
- Dedicated `languages` section with CEFR levels (A1–C2) or native.
- Profile of 3–4 lines; 2 pages maximum. The exporter warns when the CV exceeds `--max-pages` or the last page is less than half full.
- `alignment` is an internal keyword checklist: visible in the HTML preview, never printed in the PDF.
- Exported file name: `<Short-Name>-CV-<Role>.pdf` (override with `person.shortName`, `target.fileRole`, `output.fileName` or `--file-name`).
- Set `lang` (`es`, `en`) so the PDF declares the right document language.
- Run `npm run validate -- --app <application-id>` to check one application against these conventions.

## Android

Best for Kotlin, Jetpack Compose, Android SDK, mobile architecture, CI/CD, testing, and product collaboration.

## Backend

Best for Java, Spring Boot, Go, Python, APIs, databases, cloud, observability, and batch processing.

## Fullstack

Best for product-oriented profiles spanning frontend, backend, mobile, cloud, and delivery ownership.

## ATS

Plain layout for maximum parser compatibility. Use when a job platform is strict or when visual design is less important than parsing reliability.

## Cover Letter

Simple one-page letter template. Export with:

```bash
npm run pdf -- --kind cover-letter --slug example-application --data cover-letter-sample
```
