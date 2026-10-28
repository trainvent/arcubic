import Color from 'colorjs.io';
import { gray, grayDark } from '@radix-ui/colors';
export type Mode = 'dark' | 'light';
export function generateHuePalette(count = 3, exponent = 3): string[] {
  if (!Number.isInteger(count) || count < 2) throw new RangeError('Use at least two colors.');
  if (!Number.isFinite(exponent) || exponent <= 0) throw new RangeError('Use a positive exponent.');
  return Array.from({length: count}, (_, i) => {
    const t = i / (count - 1);
    const hue = 17.79 + (169.88 - 17.79) * t ** exponent;
    return new Color(`hsl(${hue} 75% 45%)`).to('srgb').toString({format: 'hex'}).toUpperCase();
  });
}
const [orange, amber, teal] = generateHuePalette();
export const defaults = { teal, amber, orange };
export type Seeds = typeof defaults;
export const names = { teal: 'Teal', amber: 'Amber', orange: 'Burnt orange' };
export const keys = Object.keys(defaults) as (keyof Seeds)[];
const hex = (c: Color) => c.to('srgb').toGamut({method: 'css'}).toString({format: 'hex'});
export function contrast(a: string, b: string) {
  return Color.contrast(new Color(a), new Color(b), 'WCAG21');
}
export function foreground(bg: string) { return contrast(bg, '#ffffff') > contrast(bg, '#101615') ? '#ffffff' : '#101615'; }
export function createPalette(seeds: Seeds, mode: Mode) {
  const dark = mode === 'dark';
  const base = dark ? grayDark : gray;
  const neutrals = Object.values(base).map(value => {
    const c = new Color(value).to('oklch');
    return hex(new Color('oklch', [c.coords[0], 0.009, 170]));
  });
  const scales = Object.fromEntries(keys.map(key => {
    const seed = new Color(seeds[key]).to('oklch');
    const [l, c, seedHue] = seed.coords;
    const h = Number.isFinite(seedHue) ? seedHue : 170;
    const lightness = dark ? [.13,.17,.22,.27,.31,.36,.42,.50,l,Math.min(l+.055,.88),.79,.93] : [.99,.975,.95,.92,.88,.83,.75,.65,l,Math.max(l-.045,.25),.40,.24];
    const chroma = [.018,.025,.045,.065,.085,.10,.12,.14,c,c,.12,.045];
    return [key,lightness.map((v,i) => i === 8 ? seeds[key].toLowerCase() : hex(new Color('oklch',[v, chroma[i],h])))];
  })) as Record<keyof Seeds,string[]>;
  return { neutrals, scales };
}
// Reconstruct each solid step as a transparent overlay on the theme background.
function alphaColor(value: string, background: string) {
  const fg = new Color(value).to('srgb').coords;
  const bg = new Color(background).to('srgb').coords;
  const a = Math.min(1,Math.max(...fg.map((v,i) => v > bg[i] ? (v-bg[i])/(1-bg[i]) : bg[i] ? (bg[i]-v)/bg[i] : 0)));
  if (a < .0001) return '#00000000';
  const rgb = fg.map((v,i)=>Math.round(Math.max(0,Math.min(1,(v-bg[i]*(1-a))/a))*255).toString(16).padStart(2,'0'));
  return `#${rgb.join('')}${Math.ceil(a*255).toString(16).padStart(2,'0')}`;
}
export function themeTokens(seeds: Seeds, mode: Mode) {
  const p = createPalette(seeds,mode);
  const tokens: Record<string,string> = {'--color-background':p.neutrals[0]};
  const groups = {gray:p.neutrals,teal:p.scales.teal,amber:p.scales.amber,orange:p.scales.orange};
  for (const [key,scale] of Object.entries(groups)) {
    scale.forEach((value,i)=> {tokens[`--${key}-${i+1}`]=value; tokens[`--${key}-a${i+1}`]=alphaColor(value,p.neutrals[0]);});
    tokens[`--${key}-contrast`]=foreground(scale[8]);
    tokens[`--${key}-surface`]=scale[1];
    tokens[`--${key}-indicator`]=scale[8];
    tokens[`--${key}-track`]=scale[8];
  }
  tokens['--color-panel-solid']=p.neutrals[1];
  tokens['--color-panel-translucent']=p.neutrals[1];
  tokens['--color-surface']=p.neutrals[1];
  return tokens;
}
export function exportCSS(seeds: Seeds) {
  return '/* Prism · Logo palette · Radix Themes overrides\n   Import after @radix-ui/themes/styles.css. Use accentColor="teal".\n   Custom OKLCH scales; review contrast for your intended usage. */\n\n' + (['light','dark'] as const).map(mode=>`${mode === 'light' ? ':root, .light, .light-theme' : '.dark, .dark-theme'} {\n${Object.entries(themeTokens(seeds,mode)).map(([k,v])=>`  ${k}: ${v};`).join('\n')}\n}`).join('\n\n');
}
