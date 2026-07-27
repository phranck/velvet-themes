# Velvet Themes

Community themes for the [Velvet](https://github.com/phranck/velvet) status
page configurator.

Each theme lives in its own JSON file under [`themes/`](themes). Velvet's
central registry workflow validates every contribution and publishes the
combined registry as `index.json` on GitHub Pages:

<https://phranck.github.io/velvet-themes/index.json>

## Add a theme

1. Copy an existing file in [`themes/`](themes).
2. Give the theme a unique lowercase kebab-case `id` and a descriptive name.
3. Set all nine named palette colors as six-digit hexadecimal values.
4. Preview the theme in the local Velvet configurator.
5. Open a pull request. The repository workflow validates it automatically.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the complete theme format.

## License

[MIT](LICENSE)
