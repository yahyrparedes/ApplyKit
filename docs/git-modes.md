# Git Modes

## Public Template Mode

Default mode. Safe for publishing.

Tracked:

- generator code
- docs
- anonymous samples
- `.gitkeep` placeholders

Ignored:

- `sources/`
- `master-info/`
- real `applications/`
- `output/`
- `temp/`

## Private Workspace Mode

Use only in private repositories.

Uncomment the private allow-list in `.gitignore` if you want to version:

- `master-info/*.md`
- `applications/index.json`
- `applications/**/*.json`
- `applications/**/*.md`

Generated PDFs and previews should usually remain ignored.
