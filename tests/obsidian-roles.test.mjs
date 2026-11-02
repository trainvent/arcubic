import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import Color from 'colorjs.io';
import {defaults,themeTokens} from '../src/palette.ts';
import {obsidianColors,obsidianAccentFamilies} from '../ports/obsidian/colors.ts';

for(const mode of ['light','dark']){
 test(`${mode}: Obsidian assignments are independent of shared web roles`,()=>{
  const palette=themeTokens(defaults,mode),expected=obsidianColors(palette);
  const poisoned={...palette,...Object.fromEntries(Object.keys(palette).filter(key=>key.startsWith('--arc-text-')).map(key=>[key,'#ff00ff']))};
  assert.deepEqual(obsidianColors(poisoned),expected);
  assert.equal(expected['--arc-obs-link-hover'],palette[`--${obsidianAccentFamilies.link}-12`],'Hover stays in the link color family');
 });
 test(`${mode}: five Obsidian accents and solid-control labels meet text contrast`,()=>{
  const p=themeTokens(defaults,mode),c=obsidianColors(p);
  const ratio=(a,b)=>Color.contrast(new Color(a),new Color(b),'WCAG21');
  for(const hue of ['primary','detail','section','emphasis','link'])for(const step of [1,2,3,4]){
   assert.ok(ratio(c[`--arc-obs-${hue}`],p[`--gray-${step}`])>=4.5,`${hue} on surface ${step}`);
  }
  assert.ok(ratio(c['--arc-obs-on-primary'],p[`--${obsidianAccentFamilies.primary}-9`])>=4.5);
  assert.ok(ratio(c['--arc-obs-on-checkbox'],c['--arc-obs-detail'])>=4.5);
 });
}
test('Component styles cannot bypass the Obsidian color map',()=>{
 for(const file of ['theme.css','plugins.css']){
  const source=readFileSync(new URL(`../ports/obsidian/src/${file}`,import.meta.url),'utf8');
  assert.doesNotMatch(source,/var\(--(?:teal|lime|amber|gold|orange|arc-text)-/);
 }
});
