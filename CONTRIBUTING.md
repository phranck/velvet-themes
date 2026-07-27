# Contributing a theme

Theme contributions only require a pull request to this repository. They do
not require a fork of the Velvet application repository.

## Theme file

Create one JSON file under `themes/`. Start from an existing theme and keep
the filename aligned with its unique `id`.

Every theme requires these fields:

```json
{
  "id": "my-theme",
  "name": "My Theme",
  "author": "Your name",
  "theme": {
    "palette": {
      "canvas": "#101116",
      "foreground": "#efedf5",
      "accent": "#8ca5ff",
      "alternate": "#63d8ff",
      "warning": "#d29922",
      "danger": "#f85149",
      "textPrimary": "#efedf5",
      "textSecondary": "#979aa8",
      "textTertiary": "#6f7280"
    }
  }
}
```

The optional `theme` groups mirror the Velvet configurator:

- `grid`: `operational`, `degraded`, `outage`, `noData`
- `protocol`: `ipv4`, `ipv6`
- `chart`: line styles, fill, background, and background opacity
- `background`: vertical gradient and cloudy blobs
- `card`: colors, border, shadow, radius, padding, and width
- `headline`: gradient colors
- `service`: icon color
- `text`: primary, secondary, and tertiary colors

A color role accepts `auto`, a named palette key, or a six-digit hexadecimal
color. The build rejects unknown fields, executable values, duplicate IDs, and
controls outside Velvet's supported ranges.

## Local checks

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

The generated `dist/` directory is local build output and must not be
committed.
