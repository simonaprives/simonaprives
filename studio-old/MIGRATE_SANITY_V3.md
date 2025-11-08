Sanity Studio migration plan — v2 -> v3 (safe, incremental)
=========================================================

This document lists a safe, repeatable plan to migrate the Studio in this repo from the older Sanity v2-style setup (uses `sanity.json` and `createSchema`) to a modern Sanity config (`sanity.config.js` / v3+). The migration touches packages, configuration and schema code; it should be done incrementally and tested frequently.

Important notes before you start
- I created branch `migrate/sanity-v3` to hold migration work.
- There is a backup branch `backup/studio-upgrade-2025-11-08` containing the previously-updated package state.
- Migration can be breaking. We'll proceed in small steps, with commits and smoke-tests (start the Studio) after each step.

Checklist (high level)
1. Create migration branch and commit current working state. (done)
2. Audit current Studio package versions and identify a target compatible set for v3.
3. Update project-level Node instructions (`.nvmrc`) and ensure Node 20.19.0 is used (already present).
4. Update Studio deps in a controlled way (group upgrades) and install.
5. Add a v3-style `sanity.config.js` that mirrors `sanity.json` settings (projectId, dataset, plugins).
6. Convert schemas from v2 format (createSchema/imports) to v3-compatible exports (use defineType/defineField or export types array) — do this file-by-file.
7. Fix plugin and desk-structure incompatibilities (some plugins or custom desk code may need API changes).
8. Test the Studio (sanity start) and fix runtime errors.
9. Clean up, run `npm audit`, and finalize the migration commit.

Recommended migration approach (step-by-step)

Phase A — Preparation (safe, automated)
- Create a branch (done). Commit `studio/package.json`, `studio/yarn.lock`/`package-lock.json` and any changed files so we can revert.
- Run `npx @sanity/cli@latest versions` inside `studio/` to see installed vs latest packages.
- Add a migration doc (this file) and a short README note describing that Studio is being migrated.

Phase B — Add v3 config scaffold
- Add `studio/sanity.config.js` that mirrors `sanity.json` fields (projectId, dataset, plugins) but in the v3 `defineConfig` form. Initially, this file can import existing schemas (we'll adapt them next).

Example `sanity.config.js` scaffold (edit values as needed):

```js
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import schemas from './schemas/schema'

export default defineConfig({
  name: 'default',
  title: 'Content Studio',
  projectId: 'xkgmhl6j',
  dataset: 'production',
  plugins: [deskTool()],
  schema: { types: schemas.types || [] }
})
```

Note: We'll create this scaffold but won't enable major package upgrades until the schema refactors are done.

Phase C — Schema conversion (manual, per-file)
- The v2 `createSchema` pattern should be replaced with the v3 `defineType`/`defineField` helpers, and `schema.js` should export the types array instead of calling `createSchema`.
- Convert documents in `studio/schemas/documents/*.js` and objects in `studio/schemas/objects/*.js` one-by-one. For each file:
  - Replace `export default { name: 'post', type: 'document', fields: [...] }` style if present, or wrap fields with `defineType`.
  - Ensure imports are plain relative imports (no `part:@sanity/*` in schema files).
  - Run `sanity start` and fix any runtime errors.

Phase D — Plugins & desk structure
- The desk structure code (`deskStructure.js`) may use older APIs. Update to modern desk tool APIs if necessary.
- Replace any deprecated `part:@sanity/desk-tool` imports and plugin usages.

Phase E — Upgrade @sanity/* and React to target versions
- Once schema and desk code are updated, you can bump `@sanity/*` packages and React (18/19) in `studio/package.json` in a controlled way.
- For example, upgrade React to v18 first, test, then bump Sanity packages to latest.
- Use `npm install` (or pnpm) and run `sanity start` after each bump.

Phase F — Finalize
- Remove `sanity.json` (or keep as backup) and ensure `sanity.config.js` is the authoritative config.
- Commit migration changes, run a full test of the Studio, and update README.

Tools & commands I will use (examples)
```bash
# create and switch branch (done):
git switch -c migrate/sanity-v3

# show versions
cd studio && npx @sanity/cli@latest versions

# scaffold sanity.config.js (I'll create a starter file if you want)

# to convert a schema file you might:
# replace `import createSchema` with `import {defineType, defineField} from 'sanity'
# and export the type directly.

# after changes:
cd studio && npm install && npm run dev
```

Risk & rollback
- I will create branches and commits before changing code. If things break we can revert to `backup/studio-upgrade-2025-11-08` or the branch prior to migration.

Next actions (choose one)
1) I scaffold `studio/sanity.config.js` and create a first-pass migration commit (low-risk). Then we convert one schema file and test the Studio.
2) I convert all schema files automatically to v3 style (higher risk) — I do not recommend doing this without manual testing.
3) Stop here and I provide detailed step-by-step commands for you to run locally.

Tell me which next action you'd like. If you want me to proceed, I'll scaffold `sanity.config.js` and convert the `schemas/schema.js` to a v3-friendly export and then attempt to start the Studio to report errors.
