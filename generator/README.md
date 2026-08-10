# Generator

HTML/CSS CV generator and application dashboard.

## Scripts

Install dependencies:

```bash
npm install
npx playwright install chromium
npm run validate
```

Run:

```bash
npm run start
npm run pdf -- --template android --slug efrontiers-android-midlevel --path /applications/android/efrontiers-android-midlevel/cv-data.json
npm run export:all
```

## Templates

- `templates/android.html`
- `templates/backend.html`
- `templates/fullstack.html`
- `templates/ats.html`
- `templates/cover-letter.html`

All templates use:

- `assets/styles.css`
- `assets/render.js`
- `assets/cover-letter-render.js`
- `assets/logo.svg`

The dashboard uses:

- `assets/dashboard.js`
- `../applications/index.json`

## Data Sources

Templates can load data in two ways:

```text
?data=backend-sample
?data=android-sample
?data=cover-letter-sample
?path=/applications/android/efrontiers-android-midlevel/cv-data.json
```

Use `data=` for reusable examples and `path=` for real applications.

## Create Application

```bash
npm run new -- --role android --company example-company --title android-developer --template android
```
