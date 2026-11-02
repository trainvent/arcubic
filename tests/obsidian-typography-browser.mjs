import {chromium} from 'playwright-core';
import {readFileSync} from 'node:fs';
import {parseArgs} from 'node:util';

const {values}=parseArgs({options:{'native-css':{type:'string'},browser:{type:'string',default:'/usr/bin/google-chrome'}}});
if(!values['native-css'])throw Error('Pass --native-css /path/to/Obsidian/app.css.');
const native=readFileSync(values['native-css'],'utf8');
const theme=readFileSync(new URL('../theme.css',import.meta.url),'utf8');
const fixture=readFileSync(new URL('fixtures/obsidian-typography.html',import.meta.url),'utf8');
const browser=await chromium.launch({executablePath:values.browser,headless:true,args:['--no-sandbox']});
const failures=[];let checks=0;const readingSizes={};
try{
 for(const mode of ['light','dark'])for(const mobile of [false,true])for(const readingSize of [16,22]){
  const page=await browser.newPage({viewport:{width:mobile?390:1100,height:900}});
  const samples={};
  for(const variant of ['native','arcubic']){
   await page.setContent(`<style>${native}</style>${variant==='arcubic'?`<style>${theme}</style>`:''}<body class="theme-${mode} ${mobile?'is-mobile is-phone':''}">${fixture}</body>`);
   // Model the setting Obsidian applies, including mobile's preferred-size scaling.
   await page.evaluate(size=>document.body.style.setProperty('--font-text-size',`${size}px`),readingSize);
   samples[variant]=await page.locator('[data-size]').evaluateAll(els=>Object.fromEntries(els.map(el=>[el.dataset.size,getComputedStyle(el).fontSize])));
  }
  for(const [element,expected] of Object.entries(samples.native)){
   checks++;const actual=samples.arcubic[element];if(actual!==expected)failures.push({mode,mobile,readingSize,element,expected,actual});
  }
  readingSizes[`${mode}-${mobile}-${readingSize}`]=samples.arcubic.reading;
  await page.close();
 }
}finally{await browser.close();}
console.log(JSON.stringify({checks,failures:failures.length,examples:failures,readingSizes},null,2));
if(failures.length)process.exitCode=1;
