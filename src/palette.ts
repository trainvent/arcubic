import Color from 'colorjs.io';
import * as radix from '@radix-ui/colors';
import { sage, sageDark, orange as radixOrange, amber as radixAmber, teal as radixTeal } from '@radix-ui/colors';
export type Mode = 'dark' | 'light';
// Original and Soft use the cubic hue curve; Radix uses its own HSL anchors.
const radixAnchors = [radixTeal.teal9, radixAmber.amber9, radixOrange.orange9]
  .map(value => new Color(value).to('hsl').coords);
export function hueForI(i: number): number {
  return 17.79 + 152.09 * (1 - i) ** 3;
}
export function generateHuePalette(count = 3, profile: 'radix' | 'original' | 'soft' = 'radix'): string[] {
  if (!Number.isInteger(count) || count < 2) throw new RangeError('Use at least two colors.');
  return Array.from({length: count}, (_, index) => {
    const t = index / (count - 1);
    const segment = t <= 0.5 ? 0 : 1;
    const weight = (t - segment * 0.5) * 2;
    const hue = profile === 'radix'
      ? radixAnchors[segment][0] * (1 - weight) + radixAnchors[segment + 1][0] * weight
      : hueForI(t);
    const anchors = profile === 'soft' ? [[0, 70, 42], [0, 90, 58], [0, 82, 51]] : radixAnchors;
    const saturation = profile === 'original' ? 75 : anchors[segment][1] * (1 - weight) + anchors[segment + 1][1] * weight;
    const lightness = profile === 'original' ? 45 : anchors[segment][2] * (1 - weight) + anchors[segment + 1][2] * weight;
    return new Color(`hsl(${hue} ${saturation}% ${lightness}%)`).to('srgb').toString({format: 'hex'}).toUpperCase();
  });
}
const [teal, amber, orange] = generateHuePalette();
export const defaults = { teal, amber, orange };
export type Seeds = typeof defaults;
const [originalTeal, originalAmber, originalOrange] = generateHuePalette(3, 'original');
const [softTeal, softAmber, softOrange] = generateHuePalette(3, 'soft');
export const softSeeds: Seeds = {teal: softTeal, amber: softAmber, orange: softOrange};
const [radixTealSeed, radixAmberSeed, radixOrangeSeed] = generateHuePalette(3, 'radix');
export const radixSeeds: Seeds = {teal: radixTealSeed, amber: radixAmberSeed, orange: radixOrangeSeed};
export const originalSeeds: Seeds = {teal: originalTeal, amber: originalAmber, orange: originalOrange};
export const names = { teal: 'Teal', amber: 'Amber', orange: 'Burnt orange' };
export const keys = Object.keys(defaults) as (keyof Seeds)[];
const nativeScales = {
  green: [radix.green, radix.greenDark, radix.greenA, radix.greenDarkA],
  tomato: [radix.tomato, radix.tomatoDark, radix.tomatoA, radix.tomatoDarkA],
  sage: [radix.sage, radix.sageDark, radix.sageA, radix.sageDarkA],
  teal: [radix.teal, radix.tealDark, radix.tealA, radix.tealDarkA],
  amber: [radix.amber, radix.amberDark, radix.amberA, radix.amberDarkA],
  orange: [radix.orange, radix.orangeDark, radix.orangeA, radix.orangeDarkA],
};
function nativeScale(key: keyof typeof nativeScales, mode: Mode, alpha = false): string[] {
  return Object.values(nativeScales[key][(mode === 'dark' ? 1 : 0) + (alpha ? 2 : 0)]);
}
function isRadixSeed(key: keyof Seeds, seeds: Seeds) {
  return seeds[key].toLowerCase() === radixSeeds[key].toLowerCase();
}
const hex = (c: Color) => c.to('srgb').toGamut({method: 'css'}).toString({format: 'hex'});
export function contrast(a: string, b: string) {
  return Color.contrast(new Color(a), new Color(b), 'WCAG21');
}
export function foreground(bg: string) { return contrast(bg, '#ffffff') > contrast(bg, '#101615') ? '#ffffff' : '#101615'; }
export function createPalette(seeds: Seeds, mode: Mode) {
  const dark = mode === 'dark';
  const neutrals = Object.values(dark ? sageDark : sage);
  // Light canvas is near-white; filled panels keep the Sage step-2 surface.
  if (!dark) neutrals[0] = '#feffff';
  const scales = Object.fromEntries(keys.map(key => {
    if (isRadixSeed(key, seeds)) return [key, nativeScale(key, mode)];
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
  const groups = {gray:p.neutrals,teal:p.scales.teal,amber:p.scales.amber,orange:p.scales.orange,green:nativeScale('green',mode),tomato:nativeScale('tomato',mode)};
  for (const [key,scale] of Object.entries(groups)) {
    const native = key === 'gray' || key === 'green' || key === 'tomato' || isRadixSeed(key as keyof Seeds, seeds);
    const alpha = native ? nativeScale(key === 'gray' ? 'sage' : key as keyof typeof nativeScales, mode, true) : null;
    scale.forEach((value,i)=> {tokens[`--${key}-${i+1}`]=value; tokens[`--${key}-a${i+1}`]=alpha?.[i] ?? alphaColor(value,p.neutrals[0]);});
    tokens[`--${key}-contrast`]=native ? (key === 'amber' ? '#21201c' : '#ffffff') : foreground(scale[8]);
    const surfaces: Record<string, [string, string]> = {gray:['#ffffffcc','#1e201f80'],teal:['#f0faf8cc','#13272580'],amber:['#fefae4cc','#271f1380'],orange:['#fff5e9cc','#271d1380'],green:['#f1faf4cc','#15251d80'],tomato:['#fff6f5cc','#2d191580']};
    tokens[`--${key}-surface`]=native ? surfaces[key][mode === 'dark' ? 1 : 0] : scale[1];
    tokens[`--${key}-indicator`]=scale[8];
    tokens[`--${key}-track`]=scale[8];
  }
  // Select foregrounds per Sage surface; preserve the underlying Radix steps.
  for (const key of keys) {
    const scale = p.scales[key];
    for (const [surface, background] of [['page', p.neutrals[0]], ['panel', p.neutrals[1]]] as const) {
      const step = contrast(scale[10], background) >= 4.5 ? 11 : 12;
      tokens[`--${key}-text-on-${surface}`] = scale[step - 1];
    }
    tokens[`--${key}-text`] = tokens[`--${key}-text-on-page`];
  }
  for (const [role, key] of [['success','green'],['warning','amber'],['error','tomato']] as const) {
    const scale = key === 'amber' ? p.scales.amber : nativeScale(key,mode);
    tokens[`--color-${role}-background`] = scale[2];
    tokens[`--color-${role}-border`] = scale[6];
    tokens[`--color-${role}-text`] = contrast(scale[10],scale[2]) >= 4.5 ? scale[10] : scale[11];
    tokens[`--color-${role}-solid`] = scale[8];
  }
  tokens['--color-selection-background'] = p.scales.teal[4];
  tokens['--color-selection-text'] = contrast(p.scales.teal[10],p.scales.teal[4]) >= 4.5 ? p.scales.teal[10] : p.scales.teal[11];
  tokens['--color-overlay'] = mode === 'dark' ? '#00000099' : '#00000066';
  tokens['--color-panel-solid']=p.neutrals[1];
  tokens['--color-panel-translucent']=p.neutrals[1];
  tokens['--color-surface']=p.neutrals[1];
  return tokens;
}
export function exportCSS(seeds: Seeds) {
  return '/* Arcubic · Logo palette · Radix Themes overrides\n   Import after @radix-ui/themes/styles.css. Use accentColor="teal".\n   Radix Teal, Amber, Orange and Sage scales. Edited anchors use custom OKLCH scales. */\n\n' + (['light','dark'] as const).map(mode=>`${mode === 'light' ? ':root, .light, .light-theme' : '.dark, .dark-theme'} {\n${Object.entries(themeTokens(seeds,mode)).map(([k,v])=>`  ${k}: ${v};`).join('\n')}\n}`).join('\n\n');
}
