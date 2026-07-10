# Contributing a theme

Community themes are added by **Pull Request**. It's just one folder.

## 1. Make your theme

The easiest path: open Panther → **Settings → Appearance → Customize Theme**, tweak the colors, and click **Export**. That gives you a valid `theme.json`.

## 2. Add the folder

Create `themes/community/<your-slug>/` with:

```
themes/community/<your-slug>/
  theme.json    # REQUIRED — your theme (schema-validated)
  README.md     # REQUIRED — shown on the theme's in-app detail page
  preview.png   # optional — a screenshot
```

- `<your-slug>` is kebab-case (e.g. `tokyo-night`) and **must equal** the `id` field in `theme.json`.
- Every color is either **hex** (`#7aa2f7`, `#0f0`) or shadcn **HSL-space** (`"217 92% 73%"`).
- Required color groups: `foundation` (19 tokens), `trading` (4), `chart` (8). Optional: `venue`, `outcome`, `typography`, `layout` — omitted tokens fall back to the Default theme.
- Full field reference: [`schema/theme.schema.json`](./schema/theme.schema.json).

## 3. Regenerate the manifest

```bash
npm install
npm run build      # validates all themes + rewrites index.json
```

Commit the updated `index.json` along with your theme.

## 4. Open a PR

CI (`npm run build --check`) re-validates every theme, requires your README, and fails if `index.json` is stale. Once it's green and a maintainer merges, your theme is live in the terminal.

### Guidelines
- Keep it readable — themes are trading UIs, so gains/losses must be distinguishable (avoid red/green-only if you can; consider colorblind-friendly pairs).
- One theme per PR keeps review easy.
- Be excellent to each other. No offensive names or content.
