#!/usr/bin/env node
// Validates every theme against schema/theme.schema.json, requires a README per
// theme, and regenerates index.json (the manifest the Panther app fetches).
//   node scripts/build-manifest.mjs          → write index.json
//   node scripts/build-manifest.mjs --check  → fail if index.json is stale (CI)
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const CHECK = process.argv.includes('--check')
const CATEGORIES = ['official', 'community']

const schema = JSON.parse(readFileSync(join(ROOT, 'schema/theme.schema.json'), 'utf8'))
const validate = new Ajv2020({ allErrors: true, strict: false }).compile(schema)

const errors = []
const seen = new Map()
const entries = []

for (const category of CATEGORIES) {
  const catDir = join(ROOT, 'themes', category)
  if (!existsSync(catDir)) continue
  const slugs = readdirSync(catDir).filter((n) => statSync(join(catDir, n)).isDirectory())
  for (const slug of slugs.sort()) {
    const dir = join(catDir, slug)
    const themePath = join(dir, 'theme.json')
    const relPath = `themes/${category}/${slug}/theme.json`
    const relReadme = `themes/${category}/${slug}/README.md`

    if (!existsSync(themePath)) { errors.push(`${category}/${slug}: missing theme.json`); continue }
    if (!existsSync(join(dir, 'README.md'))) errors.push(`${category}/${slug}: missing README.md (required)`)

    let theme
    try { theme = JSON.parse(readFileSync(themePath, 'utf8')) }
    catch (e) { errors.push(`${relPath}: invalid JSON — ${e.message}`); continue }

    if (!validate(theme)) {
      for (const err of validate.errors) errors.push(`${relPath}: ${err.instancePath || '/'} ${err.message}`)
      continue
    }
    if (theme.id !== slug) errors.push(`${relPath}: id "${theme.id}" must match folder name "${slug}"`)
    if (seen.has(theme.id)) errors.push(`${relPath}: duplicate id "${theme.id}" (also in ${seen.get(theme.id)})`)
    seen.set(theme.id, relPath)

    entries.push({
      id: theme.id,
      name: theme.name,
      ...(theme.description ? { description: theme.description } : {}),
      ...(theme.author ? { author: theme.author } : {}),
      ...(theme.version ? { version: theme.version } : {}),
      ...(Array.isArray(theme.tags) && theme.tags.length ? { tags: theme.tags } : {}),
      category,
      path: relPath,
      readmePath: relReadme,
    })
  }
}

if (errors.length) {
  console.error('Theme validation failed:\n' + errors.map((e) => '  ✗ ' + e).join('\n'))
  process.exit(1)
}

const order = { official: 0, community: 1 }
entries.sort((a, b) => order[a.category] - order[b.category] || a.name.localeCompare(b.name))

const manifest = JSON.stringify(entries, null, 2) + '\n'
const manifestPath = join(ROOT, 'index.json')

if (CHECK) {
  const current = existsSync(manifestPath) ? readFileSync(manifestPath, 'utf8') : ''
  if (current !== manifest) {
    console.error('✗ index.json is stale — run `npm run build` and commit the result.')
    process.exit(1)
  }
  console.log(`✓ index.json up to date (${entries.length} themes).`)
} else {
  writeFileSync(manifestPath, manifest)
  console.log(`✓ Wrote index.json (${entries.length} themes).`)
}
