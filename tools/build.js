// Writes theme.css (a Tailwind 4 @theme) and tokens.css (the same values as
// plain custom properties, for a page with no build step) from tokens.json.
//
//   node tools/build.js           write both
//   node tools/build.js --check   fail if either differs from what it would write

import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const { light, dark } = JSON.parse(fs.readFileSync(new URL('tokens.json', root), 'utf8'));

// Tailwind writes a shadow's value into its utility when it builds, so a dark
// value under the same name would never reach shadow-panel. In theme.css a
// shadow token names a -value property instead, which each mode sets.
const live = (name) => name.startsWith('shadow-');
const valueOf = (name) => (live(name) ? `${name}-value` : name);

function lines(tokens, indent, rename = (name) => name) {
  return Object.entries(tokens)
    .map(([name, [value, note]]) => `${indent}--${rename(name)}: ${value};${note ? ` /* ${note} */` : ''}`)
    .join('\n');
}

const darkBlock = (rename) => `/* Dark: the same token names, so nothing needs a dark: variant. */
@media (prefers-color-scheme: dark) {
  :root {
${lines(dark, '    ', rename)}
  }
}
`;

const header = (what) => `/* ${what}
   Written by tools/build.js from tokens.json: edit that, then run npm run build. */
`;

const themed = Object.fromEntries(Object.entries(light).map(([name, [value, note]]) =>
  [name, live(name) ? [`var(--${valueOf(name)})`] : [value, note]]));
const liveValues = Object.fromEntries(Object.entries(light).filter(([name]) => live(name)));

export const files = {
  'theme.css': `${header('Sustenaut\'s design tokens for Tailwind 4. After @import "tailwindcss",\n   @import "@sustenaut/theme/theme.css" gives bg-surface, text-muted,\n   border-rule, bg-primary, font-display, rounded-panel, shadow-panel and the rest.')}
@theme {
${lines(themed, '  ')}
}

:root {
${lines(liveValues, '  ', valueOf)}
}

${darkBlock(valueOf)}`,
  'tokens.css': `${header('Sustenaut\'s design tokens as plain custom properties, for a page\n   without Tailwind: var(--color-surface), var(--font-display) and the rest.')}
:root {
${lines(light, '  ')}
}

${darkBlock()}`,
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const check = process.argv.includes('--check');
  let stale = false;
  for (const [name, text] of Object.entries(files)) {
    const path = new URL(name, root);
    const now = fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : null;
    if (now === text) continue;
    if (check) {
      console.error(`${name} is stale: run npm run build`);
      stale = true;
    } else {
      fs.writeFileSync(path, text);
      console.log(`wrote ${name}`);
    }
  }
  process.exit(stale ? 1 : 0);
}
