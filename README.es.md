# ApplyKit

**Un workspace reutilizable para postulaciones laborales asistidas por IA.**

🌐 Web: https://yahyrparedes.github.io/ApplyKit/

ApplyKit te ayuda a organizar tus documentos profesionales, generar CVs enfocados por rol, revisarlos en HTML, exportar PDFs profesionales, crear cartas de presentación y llevar el control de tus postulaciones desde un panel local.

Está pensado para personas que postulan de forma constante y quieren un flujo repetible, en lugar de rehacer el mismo CV desde cero para cada oferta.

## Por qué ApplyKit

Muchas postulaciones fallan porque se envía el mismo CV genérico a todas las ofertas.

ApplyKit propone un flujo estructurado:

- Guardar CVs antiguos, certificados, contratos, títulos y evidencias laborales.
- Convertir esa información en memoria reutilizable en Markdown.
- Generar CVs enfocados para Android, Backend, Fullstack, ATS o cualquier otro rol.
- Revisar el CV en HTML antes de exportar a PDF.
- Generar cartas de presentación desde datos estructurados.
- Llevar un tracker de postulaciones con empresa, rol, fecha, estado, preview, notas y PDF.
- Trabajar con cualquier agente de IA: ChatGPT, Claude Code, MiniMax, Cursor u otros.

## Estructura del proyecto

```text
sources/
  cv/
  supporting-documents/

master-info/
  master-cv.md
  ats-context.md
  work-timeline.md

generator/
  templates/
  assets/
  data/
  scripts/

applications/
  index.json
  android/
  backend/
  fullstack/

output/
  pdf/
  preview/

schema/
docs/
temp/
```

## Inicio rápido

### 1. Agrega tus documentos fuente

Antes de generar postulaciones reales, agrega tu evidencia profesional:

```text
sources/cv/
sources/supporting-documents/
```

Documentos recomendados:

- CVs existentes;
- certificados;
- contratos laborales;
- cartas o constancias de trabajo;
- títulos o grados;
- certificados de cursos;
- notas de portafolio;
- cualquier documento que ayude a validar fechas, roles, tecnologías o logros.

ApplyKit funciona mejor cuando un agente de IA primero construye `master-info/` a partir de tus documentos. No conviene empezar a adaptar CVs por oferta hasta que exista esa capa de memoria profesional.

Usa el primer prompt de [PROMPTS.md](PROMPTS.md) para ese paso inicial.

### 2. Instala y ejecuta

```bash
cd generator
npm install
npx playwright install chromium
npm run validate
npm run start
```

Abre:

```text
http://127.0.0.1:4173
```

## Crear una nueva postulación

```bash
cd generator
npm run new -- --role android --company example-company --title android-developer --template android
```

Esto crea:

```text
applications/android/example-company-android-developer/
  cv-data.json
  notes.md
```

## Previsualizar un CV

```text
http://127.0.0.1:4173/generator/templates/android.html?path=/applications/android/example-company-android-developer/cv-data.json
```

## Exportar PDF

```bash
cd generator
npm run pdf -- --template android --slug example-company-android-developer --path /applications/android/example-company-android-developer/cv-data.json
```

El PDF se genera en:

```text
output/pdf/example-company-android-developer/<Short-Name>-CV-<Role>.pdf
```

## Exportar carta de presentación

```bash
cd generator
npm run pdf -- --kind cover-letter --slug example-company-android-developer --data cover-letter-sample
```

## Modos de Git

ApplyKit soporta dos formas de uso.

### Modo plantilla pública

Es el modo por defecto. Está pensado para publicar el repositorio como template.

Se trackea:

- código del generador;
- documentación;
- schemas;
- ejemplos anónimos;
- placeholders `.gitkeep`.

Se ignora:

- CVs personales;
- certificados y contratos;
- memoria profesional extraída;
- postulaciones reales;
- PDFs y screenshots generados;
- archivos temporales.

### Modo workspace privado

Úsalo si el repositorio será privado y quieres versionar tus datos estructurados.

El `.gitignore` incluye una sección comentada para permitir:

- `master-info/*.md`;
- `applications/index.json`;
- `applications/**/*.json`;
- `applications/**/*.md`.

Normalmente los PDFs y previews deben seguir ignorados porque se pueden regenerar.

## Filosofía

ApplyKit no es solo un generador de CV.

Es un sistema local-first y preparado para IA donde la evidencia profesional se convierte en memoria estructurada, y esa memoria se convierte en postulaciones enfocadas.

La idea es simple: dedicar menos tiempo a formatear documentos y más tiempo a enviar postulaciones relevantes y de calidad.
