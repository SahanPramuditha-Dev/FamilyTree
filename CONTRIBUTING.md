# Contributing to FamilyTree

Thanks for helping improve FamilyTree. Keep changes focused, documented, and respectful of the sensitivity of genealogy data.

## Development Workflow

1. Create a focused branch from `main`.
2. Install dependencies with `npm install`.
3. Run the app with `npm run dev`.
4. Make the smallest change that solves the issue.
5. Run `npm run build` and `npm run lint` before opening a pull request.
6. Include screenshots for user-interface changes.

## Code Conventions

- Use TypeScript and the existing React component patterns.
- Prefer shared components from `src/components/ui` before creating new primitives.
- Keep page-specific behavior in the relevant `src/pages` directory.
- Keep shared family data types in `src/types` and data transformations in `src/utils`.
- Do not commit `.env` files, service-account credentials, or private family data.
- Preserve accessibility: use semantic elements, labels, keyboard access, and readable contrast.

## Pull Requests

Describe the user-visible change, the relevant implementation, and the validation commands that passed. Call out Firebase rule or schema changes explicitly. Keep unrelated formatting and refactors out of the pull request.

## Reporting Security Issues

Do not publish private family data or Firebase credentials in an issue. Report security concerns privately to the repository owner and include reproduction steps only when it is safe to do so.
