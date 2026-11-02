import {test} from 'node:test';
import assert from 'node:assert/strict';
import {defaults,keys,themeTokens,createPalette,contrast,generateHuePalette} from '../src/palette.ts';

test('Three families retain the three established anchor colors',()=>{
 assert.deepEqual(keys,['teal','amber','orange']);
 assert.equal(defaults.teal,'#12A594');assert.equal(defaults.amber,'#FFC53D');assert.equal(defaults.orange,'#F76B15');
 assert.equal(generateHuePalette().length,3);
});
for(const mode of ['light','dark'])test(`${mode}: all three scales export readable foregrounds and alpha tokens`,()=>{
 const palette=createPalette(defaults,mode),tokens=themeTokens(defaults,mode);
 for(const key of keys){
  assert.equal(palette.scales[key].length,12);
  for(let step=1;step<=12;step++)assert.ok(tokens[`--${key}-a${step}`]);
  for(const [surface,index] of [['page',0],['panel',1]])assert.ok(contrast(tokens[`--${key}-text-on-${surface}`],palette.neutrals[index])>=4.5);
 }
});
