// The theme's own actions: reading its files and tokens, and Tailwind 4
// building utilities from theme.css. pubtest's steps check what came back.
import fs from 'node:fs';
import { When } from '@cucumber/cucumber';
import { compile } from 'tailwindcss';

const root = new URL('../', import.meta.url);
const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');
const tokens = () => JSON.parse(read('tokens.json'));

When('I list the dark tokens that override no light one', async function () {
  await this.attempt(() => { const { light, dark } = tokens(); return Object.keys(dark).filter((name) => !(name in light)); });
});

When('I list the font files fonts.css names', async function () {
  await this.attempt(() => [...read('fonts.css').matchAll(/url\("([^"]+)"\)/g)].map((m) => m[1]).sort());
});

When('I list the font families fonts.css declares', async function () {
  await this.attempt(() => [...new Set([...read('fonts.css').matchAll(/font-family: "([^"]+)"/g)].map((m) => m[1]))]);
});

When('I read the first font family the token {string} names', async function (token) {
  await this.attempt(() => tokens().light[token][0].match(/^"([^"]+)"/)[1]);
});

When('Tailwind 4 builds {string} from theme.css', async function (classes) {
  await this.attempt(async () => (await compile(`${read('theme.css')}\n@tailwind utilities;`)).build(classes.split(' ')));
});

When('I read the dark block of {string}', async function (name) {
  await this.attempt(() => { const text = read(name); return text.slice(text.indexOf('@media')); });
});
