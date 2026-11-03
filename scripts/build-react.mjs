import {build} from 'esbuild';
import {execFileSync} from 'node:child_process';
import {mkdirSync,rmSync,readFileSync,writeFileSync,copyFileSync} from 'node:fs';
const out='packages/react/dist';
mkdirSync('dist',{recursive:true});
rmSync(out,{recursive:true,force:true});
mkdirSync(`${out}/fonts`,{recursive:true});
await build({entryPoints:['src/components/index.ts'],outfile:`${out}/index.js`,bundle:true,format:'esm',platform:'browser',packages:'external',jsx:'automatic',banner:{js:'"use client";'}});
execFileSync('node_modules/.bin/tsc',['--declaration','--emitDeclarationOnly','--noEmit','false','--outDir',out,'--target','ES2022','--module','ESNext','--moduleResolution','Bundler','--jsx','react-jsx','--skipLibCheck','--strict','src/components/index.ts'],{stdio:'inherit'});
copyFileSync('packages/core/arcubic-tokens.css',`${out}/tokens.css`);
let fonts='';
for(const [name,family,weights,styles] of [['chakra-petch','Chakra Petch',[400],['normal']],['lora','Lora',[400,700],['normal','italic']],['geist-mono','Geist Mono',[400],['normal']]]){
 copyFileSync(`node_modules/@fontsource/${name}/LICENSE`,`${out}/fonts/${name}-LICENSE`);
 for(const weight of weights)for(const style of styles){
  const file=`${name}-latin-${weight}-${style}.woff2`;
  copyFileSync(`node_modules/@fontsource/${name}/files/${file}`,`${out}/fonts/${file}`);
  fonts+=`@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:swap;src:url('./fonts/${file}') format('woff2')}\n`;
 }
}
writeFileSync(`${out}/fonts.css`,fonts);
// The full stylesheet works without a consumer importing Radix or preview CSS.
const tokens=readFileSync(`${out}/tokens.css`,'utf8').replaceAll('.arcubic-theme[data-mode="light"]','.arcubic-theme.light').replaceAll('.arcubic-theme[data-mode="dark"]','.arcubic-theme.dark');
writeFileSync(`${out}/styles.css`,['@import "./fonts.css";',readFileSync('node_modules/@radix-ui/themes/styles.css','utf8'),tokens,readFileSync('src/components/base.css','utf8'),readFileSync('src/components/arcubic.css','utf8')].join('\n'));
copyFileSync('LICENSE','packages/react/LICENSE');
const root=JSON.parse(readFileSync('package.json','utf8'));
const pkg=JSON.parse(readFileSync('packages/react/package.json','utf8'));
pkg.version=root.version;
writeFileSync('packages/react/package.json',JSON.stringify(pkg,null,2)+'\n');
console.log(`Built ${pkg.name}@${pkg.version}`);
