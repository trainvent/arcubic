import {writeFileSync} from 'node:fs';
import {defaults,keys,names,generateHuePalette,themeTokens} from '../src/palette.ts';
const root=new URL('../public/',import.meta.url);
const colors=keys.map(key=>defaults[key]);
const stops=generateHuePalette(33).map((color,i)=>`<stop offset="${i/32*100}%" stop-color="${color}"/>`).join('');
const dots=colors.map((color,i)=>{const t=i/(colors.length-1);return `<circle cx="${12+104*t}" cy="${12+72*(1-(1-t)**3)}" r="7" fill="${color}"/>`;}).join('');
writeFileSync(new URL('arcubic.svg',root),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 96" fill="none"><title>Arcubic — three colors</title><desc>Teal, amber and burnt orange sampled along one arc.</desc><defs><linearGradient id="hue" x1="12" x2="116" gradientUnits="userSpaceOnUse">${stops}</linearGradient></defs><path d="M12 12 C46.6667 84 81.3333 84 116 84" stroke="url(#hue)" stroke-width="6" stroke-linecap="round"/>${dots}</svg>\n`);
const p=themeTokens(defaults,'dark');
let points=[[525,85],[907,745],[143,745]];
const triangles=[...colors].reverse().map(color=>{const shape=`<polygon points="${points.map(p=>p.join(',')).join(' ')}" fill="${color}" stroke="${p['--gray-12']}" stroke-width="5" stroke-linejoin="round"/>`;points=points.map((point,i)=>point.map((v,j)=>v*.78+points[(i+1)%3][j]*.22));return shape;}).join('');
const symbol=`<circle cx="525" cy="525" r="445" fill="none" stroke="${p['--gray-12']}" stroke-width="4"/>${triangles}`;
writeFileSync(new URL('logo.svg',root),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 1050"><title>Arcubic three-color triangle</title><rect width="1050" height="1050" fill="${p['--gray-1']}"/>${symbol}</svg>\n`);
const cards=keys.map((key,i)=>`<g transform="translate(${650+i*270} 365)"><rect width="240" height="82" fill="${defaults[key]}"/><text y="114" fill="${p['--gray-12']}" font-size="16">${names[key]}</text><text y="141" fill="${p['--gray-11']}" font-size="14">${defaults[key]}</text></g>`).join('');
writeFileSync(new URL('title.svg',root),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 620"><title>Arcubic — three colors, one curve</title><desc>Three-color cubic hue curve on a neutral charcoal background.</desc><rect width="1600" height="620" fill="${p['--gray-1']}"/><g transform="translate(40 100) scale(4.3)" fill="none"><defs><linearGradient id="title-hue" x1="12" x2="116" gradientUnits="userSpaceOnUse">${stops}</linearGradient></defs><path d="M12 12 C46.6667 84 81.3333 84 116 84" stroke="url(#title-hue)" stroke-width="6" stroke-linecap="round"/>${dots}</g><g font-family="ui-monospace,monospace"><text x="650" y="210" fill="${p['--gray-12']}" font-size="100" letter-spacing="-6">ARCUBIC</text><text x="655" y="275" fill="${p['--gray-11']}" font-size="26">Three colors. One curve.</text>${cards}</g></svg>\n`);
// PNG exports are optional: browsers and documentation use the generated SVGs.
if(process.argv.includes('--png')){
 const {default:sharp}=await import('sharp');
 for(const name of ['logo','title'])await sharp(new URL(`${name}.svg`,root).pathname).png().toFile(new URL(`${name}.png`,root).pathname);
}
console.log('Built three-color curve, triangle logo and title banner.');
