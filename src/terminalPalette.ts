import source from '../ports/terminal/arcubic-dark.Xresources?raw';
export const terminalSource = source;
const entries = Object.fromEntries(source.split('\n').filter(line=>line.startsWith('*.')).map(line=>{
 const colon=line.indexOf(':'); return [line.slice(2,colon),line.slice(colon+1).trim()];
}));
const required=['background','foreground','cursorColor','selectionBackground','selectionForeground',...Array.from({length:16},(_,i)=>`color${i}`)];
for(const key of required) if(!/^#[0-9a-f]{6}$/i.test(entries[key]||'')) throw new Error(`Invalid terminal color: ${key}`);
export const terminalPalette = {
 background:entries.background,foreground:entries.foreground,cursor:entries.cursorColor,
 selectionBackground:entries.selectionBackground,selectionForeground:entries.selectionForeground,
 colors:Array.from({length:16},(_,i)=>entries[`color${i}`]),
};
export function terminalPreviewURL(){
 const p=terminalPalette;
 const hex=[p.background,p.foreground,...p.colors].map(c=>c.slice(1)).join('');
 const bytes=hex.match(/../g)!.map(h=>String.fromCharCode(parseInt(h,16))).join('');
 return `https://terminal.sexy/#${btoa(bytes).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}`;
}
export function downloadTerminal(){
 const url=URL.createObjectURL(new Blob([terminalSource],{type:'text/plain'}));
 const a=document.createElement('a');a.href=url;a.download='arcubic-dark.Xresources';a.click();URL.revokeObjectURL(url);
}
