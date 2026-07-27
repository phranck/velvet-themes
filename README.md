# Velvet Themes

Community themes for the [Velvet](https://github.com/phranck/velvet) status
page configurator.

Each theme lives in its own JSON file under [`themes/`](themes). The build
validates every contribution and publishes the combined registry as
`index.json` on GitHub Pages:

<https://phranck.github.io/velvet-themes/index.json>

## Add a theme

1. Copy an existing file in [`themes/`](themes).
2. Give the theme a unique lowercase kebab-case `id` and a descriptive name.
3. Set all nine named palette colors as six-digit hexadecimal values.
4. Run the local checks.
5. Open a pull request.

```sh
npm ci
npm run lint
npm run typecheck
npm test
npm run build
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete theme format.

## License

[MIT](LICENSE)
