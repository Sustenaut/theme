# theme

Sustenaut's design tokens and fonts, so every site has one look whatever it
is built with: React and Tailwind (`@sustenaut/ui`), Eleventy (pubtheme), or a
static page with no build step (recipe-host). It holds no components and has
no dependencies.

| File | What it is |
|---|---|
| `theme.css` | The tokens as a Tailwind 4 `@theme`: `bg-surface`, `text-muted`, `border-rule`, `bg-primary`, `font-display`, `rounded-panel`, `shadow-panel`, … |
| `tokens.css` | The same tokens as plain custom properties: `var(--color-surface)`, `var(--font-display)`, … |
| `fonts.css`, `fonts/` | Nunito (display) and Nunito Sans (text), variable weight, Latin and Latin Extended |
| `base.css` | Optional element defaults in plain CSS: page colours, text font, links |
| `tokens.json` | The source of `theme.css` and `tokens.css` |

Both token files have the same names and values, and dark mode
(`prefers-color-scheme: dark`) sets the same names, so nothing needs a
`dark:` variant. The colours are business-plan's `brand/palette.json`.

## With Tailwind

```sh
npm install github:Sustenaut/theme#v0.1.0
```

```css
@import "tailwindcss";
@import "@sustenaut/theme/theme.css";
@import "@sustenaut/theme/fonts.css";
```

`fonts.css` loads `fonts/*.woff2` relative to itself: copy
`node_modules/@sustenaut/theme/fonts/` to `fonts/` beside the built CSS, or
let the bundler rewrite the URLs.

## Without a build step

Every release is served by jsDelivr from its tag:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Sustenaut/theme@v0.1.0/fonts.css" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/Sustenaut/theme@v0.1.0/tokens.css" crossorigin="anonymous">
```

Add each file's `integrity` (`sha384-…`, the hash of the file at that tag).
The fonts are fetched from beside `fonts.css`, so they come from the same tag.

## Changing a token

Edit `tokens.json`, then:

```sh
npm ci
npm run build   # writes theme.css and tokens.css
npm test        # fails if either is stale, and checks Tailwind builds the utilities
```

A shadow token is written to `theme.css` as `var(--shadow-…-value)`, because
Tailwind copies a shadow's value into its utility and a dark value would
otherwise never reach it.

## Releasing

With [pubrel](https://github.com/Sustenaut/pubrel), like the other Sustenaut
packages: every pull request that changes a file `release.json`'s `code`
lists records the change (`pubrel add added "…"`), and `pubrel prepare`,
run in a checkout that holds the release key (`corpus/.publet`, gitignored),
opens the release pull request. Merging it tags `vX.Y.Z`, and pubrel asks
jsDelivr for the files it lists.

## Licence

The CSS and tools are Apache-2.0 (`LICENSE`). The fonts are under the SIL Open
Font License 1.1 (`fonts/OFL-nunito.txt`, `fonts/OFL-nunito-sans.txt`), from
[Fontsource](https://fontsource.org) 5.3.0.
