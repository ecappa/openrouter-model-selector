# Testing strategy (before publishing)

## 1) Manual validation (playground)

Use the local Vite/React playground:

- `examples/playground-vite-react`
- Install + run: see the root `README.md`

Suggested manual checks:

- API key empty → should show “API key required”
- Loading state + refresh button
- Search / provider filters / capability filters
- `locale="fr"` labels
- `showAllInModal` + `infoToggle` behavior
- CSS import: `@cappasoft-dev/openrouter-model-selector/styles.css` renders correctly

## 2) Package validation (what will actually be published)

Before publishing, validate the packed output:

```bash
npm run build
npm pack -w @cappasoft-dev/openrouter-model-selector
npm pack -w @cappasoft-dev/openrouter-models
```

Then smoke-test imports from the generated `.tgz` in a clean directory.

## 3) Automated tests (recommended next)

- **Unit tests (headless)**: `@cappasoft-dev/openrouter-models`
  - grouping / sorting / recommended lists
  - client error handling (mock `fetch`)
- **UI tests**: `@cappasoft-dev/openrouter-model-selector`
  - filtering logic, rendering states
  - mock network with MSW (or inject a client abstraction)
- **E2E smoke** (Playwright):
  - run playground with mocked API response and assert the dropdown lists models

## 4) CI gates

On PR:

- `npm ci`
- `npm run build`
- `npm run typecheck`
- (later) `npm test`


