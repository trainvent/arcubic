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

for(const mode of ['light','dark'])test(`${mode}: six graph colors stay distinct and chart-ready`,async()=>{
 const {default:Color}=await import('colorjs.io');
 const tokens=themeTokens(defaults,mode);
 const colors=[1,2,3,4,5,6].map(i=>tokens[`--color-graph-${i}`]);
 assert.equal(new Set(colors).size,6);
 const [low,high]=mode==='light'?[.43,.77]:[.48,.67];
 for(const value of colors){
  const [l,c]=new Color(value).to('oklch').coords;
  assert.ok(l>=low&&l<=high,`${value} lightness ${l}`);assert.ok(c>=.1,`${value} chroma ${c}`);
 }
 // Neighbours in the Sports plugin's stacked sport chart, plus the actual/comparison pair.
 const stack=[4,5,1,2,3,6].map(i=>colors[i-1]);
 for(let i=1;i<stack.length;i++)assert.ok(new Color(stack[i-1]).deltaE(stack[i],'OK')*100>=15,`${stack[i-1]} vs ${stack[i]}`);
});
