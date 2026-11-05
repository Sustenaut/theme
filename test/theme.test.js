// The generated files match tokens.json, every font file fonts.css names is
// here, and Tailwind turns theme.css into the utilities sites use.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';

import { compile } from 'tailwindcss';

import { files } from '../tools/build.js';

const root = new URL('../', import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');

test('theme.css and tokens.css are what tools/build.js writes from tokens.json', () => {
  for (const [name, text] of Object.entries(files)) assert.equal(read(name), text, `${name} is stale: run npm run build`);
});

test('every dark token overrides a light one', () => {
  const { light, dark } = JSON.parse(read('tokens.json'));
  assert.deepEqual(Object.keys(dark).filter((name) => !(name in light)), []);
});

test('every font fonts.css names is in fonts/, and every font in fonts/ is named', () => {
  const named = [...read('fonts.css').matchAll(/url\("([^"]+)"\)/g)].map((m) => m[1]).sort();
  const present = fs.readdirSync(new URL('fonts/', root)).filter((f) => f.endsWith('.woff2')).map((f) => `fonts/${f}`).sort();
  assert.deepEqual(named, present);
});

test('the font families fonts.css declares are the ones the tokens name first', () => {
  const families = new Set([...read('fonts.css').matchAll(/font-family: "([^"]+)"/g)].map((m) => m[1]));
  const { light } = JSON.parse(read('tokens.json'));
  for (const token of ['font-sans', 'font-display']) {
    assert.ok(families.has(light[token][0].match(/^"([^"]+)"/)[1]), token);
  }
});

test('Tailwind 4 makes the utilities from theme.css', async () => {
  const compiler = await compile(`${read('theme.css')}\n@tailwind utilities;`);
  const css = compiler.build(['bg-surface', 'text-muted', 'border-rule', 'font-display', 'rounded-panel',
    'shadow-panel', 'text-seed']);
  for (const want of ['background-color: var(--color-surface)', 'color: var(--color-muted)',
    'border-color: var(--color-rule)', 'font-family: var(--font-display)', 'border-radius: var(--radius-panel)',
    'color: var(--color-seed)']) {
    assert.ok(css.includes(want), want);
  }
});

test('shadow-panel follows dark mode, as the colours do', async () => {
  const theme = read('theme.css');
  const compiler = await compile(`${theme}\n@tailwind utilities;`);
  assert.ok(compiler.build(['shadow-panel']).includes('--tw-shadow: var(--shadow-panel-value)'));
  assert.match(theme.slice(theme.indexOf('@media')), /--shadow-panel-value: 0 8px 28px rgba\(0, 0, 0, 0.5\)/);
  assert.match(read('tokens.css'), /--shadow-panel: 0 8px 28px rgba\(0, 0, 0, 0.5\)/);
});
