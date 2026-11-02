import {chromium} from 'playwright-core';
import {readFileSync} from 'node:fs';
import {parseArgs} from 'node:util';

const {values}=parseArgs({options:{'native-css':{type:'string'},'plugin-css':{type:'string'},browser:{type:'string',default:'/usr/bin/google-chrome'}}});
if(!values['native-css'])throw Error('Pass --native-css /path/to/Obsidian/app.css to exercise the actual host cascade.');
const native=readFileSync(values['native-css'],'utf8');
const plugin=values['plugin-css']?readFileSync(values['plugin-css'],'utf8'):'';
const theme=readFileSync(new URL('../theme.css',import.meta.url),'utf8');
const fixture=readFileSync(new URL('fixtures/obsidian-colors.html',import.meta.url),'utf8');
const browser=await chromium.launch({executablePath:values.browser,headless:true,args:['--no-sandbox']});
const failures=[];let checks=0;
try{
 for(const mode of ['light','dark'])for(const order of ['before','after'])for(const mobile of [false,true]){
  const page=await browser.newPage({viewport:{width:mobile?390:1100,height:1000}});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setContent(`<style>${native}</style>${order==='before'?`<style>${plugin}</style>`:''}<style>${theme}</style>${order==='after'?`<style>${plugin}</style>`:''}<style>.menu,.suggestion-container{display:block;position:static;visibility:visible}body{padding:20px;overflow:auto}a,span[data-role]{display:inline-block;margin:4px}[data-role]{scroll-margin:20px}</style><body class="theme-${mode} ${mobile?'is-mobile is-phone':''}">${fixture}</body>`);
  const targets=page.locator('[data-role]');
  for(let i=0;i<await targets.count();i++){
   const el=targets.nth(i);
   for(const state of ['normal','hover','focus']){
    const hover=state==='hover';
    if(hover&&!await el.getAttribute('data-hover-role'))continue;
    if(state==='focus'&&!await el.getAttribute('data-focus-role'))continue;
    if(hover)await el.hover();else await page.mouse.move(0,0);
    if(state==='focus'){await page.keyboard.press('Tab');await el.evaluate(e=>{e.tabIndex=0;e.focus();});}
    const result=await el.evaluate((e,hover)=>{
     const role=e.getAttribute(hover?'data-hover-role':'data-role');
     const probe=document.createElement('span');probe.style.color=`var(--arc-obs-${role})`;document.body.append(probe);
     const expected=getComputedStyle(probe).color;probe.remove();
     return {label:e.textContent.trim(),role,expected,actual:getComputedStyle(e).color};
    },hover);
    checks++;if(result.actual!==result.expected)failures.push({mode,order,mobile,hover,...result});
   }
  }
  await page.close();
 }
}finally{await browser.close();}
console.log(JSON.stringify({checks,failures:failures.length,examples:failures},null,2));
if(failures.length)process.exitCode=1;
