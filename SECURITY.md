# Security

ApplyKit is local-first, but it is designed to handle sensitive career data.

## Do Not Commit

- CV PDFs with personal information.
- Certificates, contracts, payslips, receipts, IDs, addresses, phone numbers, or signatures.
- Real application data if the repository is public.
- Generated PDFs or screenshots that include personal data.

## Recommended Modes

- Public template: keep the default `.gitignore`.
- Private workspace: use the commented allow-list in `.gitignore` only if you understand what will be versioned.

## Reporting Issues

If you find a template path, script, or documentation issue that could cause accidental personal data exposure, open a security issue or report it privately to the repository maintainer.
