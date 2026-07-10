# Panther Themes

Official and community color themes for the [Panther](https://getpanther.app) prediction-market terminal.

Browse and install these from the terminal: **Settings → Appearance → Community Themes**. You can also build your own in **Settings → Appearance → Customize Theme**, export the JSON, and open a PR here to share it.

## Repo layout

```
themes/
  official/<slug>/{ theme.json, README.md }    # shipped with Panther
  community/<slug>/{ theme.json, README.md }    # contributed via PR
schema/theme.schema.json                        # the theme JSON schema
index.json                                       # generated manifest the app fetches
scripts/build-manifest.mjs                       # validates themes + regenerates index.json
```

The app fetches [`index.json`](./index.json) and each theme's files directly over HTTPS — merged PRs go live automatically.

## Add your theme

See **[CONTRIBUTING.md](./CONTRIBUTING.md)**. In short: drop a `theme.json` + `README.md` into `themes/community/<your-slug>/`, run `npm run build`, and open a PR. CI validates it.

## License

MIT — see [LICENSE](./LICENSE).
