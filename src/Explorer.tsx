import {useState,type CSSProperties,type KeyboardEvent} from 'react';
type Entry={name:string;children?:Entry[];tone?:'teal'|'amber'|'orange'};
const entries:Entry[]=[{name:'Arcubic',tone:'teal',children:[{name:'Design',tone:'amber',children:[{name:'Principles'},{name:'Color notes'}]},{name:'Guide',tone:'teal',children:[{name:'Getting started'},{name:'Interface'},{name:'Terminal'},{name:'Installation'}]},{name:'Experiments',tone:'orange',children:[{name:'Hue curves'},{name:'Archive',children:[{name:'Early sketches'}]}]},{name:'README'}]}];
const matches=(entry:Entry,query:string):boolean=>entry.name.toLowerCase().includes(query)||!!entry.children?.some(child=>matches(child,query));
export function Explorer({query,selected,onSelect}:{query:string;selected:string;onSelect:(path:string)=>void}){
 const [closed,setClosed]=useState<Set<string>>(()=>new Set(['Arcubic/Design','Arcubic/Experiments/Archive']));
 const [searchClosed,setSearchClosed]=useState<Set<string>>(()=>new Set());
 const q=query.trim().toLowerCase();
 const toggle=(path:string)=>{
  const setter=q?setSearchClosed:setClosed;
  const key=q?`${q}:${path}`:path;
  setter(old=>{const next=new Set(old);if(next.has(key))next.delete(key);else next.add(key);return next;});
 };
 function keyboard(event:KeyboardEvent<HTMLButtonElement>,folder:boolean,open:boolean,path:string){
  const button=event.currentTarget;
  const rows=Array.from(button.closest('nav')!.querySelectorAll<HTMLButtonElement>('.arc-explorer-row'));
  const index=rows.indexOf(button);
  if(event.key==='ArrowDown'){event.preventDefault();rows[Math.min(index+1,rows.length-1)]?.focus();}
  else if(event.key==='ArrowUp'){event.preventDefault();rows[Math.max(index-1,0)]?.focus();}
  else if(event.key==='Home'){event.preventDefault();rows[0]?.focus();}
  else if(event.key==='End'){event.preventDefault();rows.at(-1)?.focus();}
  else if(event.key==='ArrowRight'&&folder){event.preventDefault();if(!open)toggle(path);else rows[index+1]?.focus();}
  else if(event.key==='ArrowLeft'){
   event.preventDefault();
   if(folder&&open)toggle(path);
   else button.parentElement?.parentElement?.closest('li')?.querySelector<HTMLButtonElement>(':scope > button')?.focus();
  }
 }
 function branch(nodes:Entry[],parent='',depth=0,showAll=false){return <ul className="arc-explorer-list">{nodes.filter(entry=>showAll||!q||matches(entry,q)).map(entry=>{
  const path=parent?`${parent}/${entry.name}`:entry.name;
  const folder=!!entry.children;
  const open=q?!searchClosed.has(`${q}:${path}`):!closed.has(path);
  const active=selected===path;
  const ancestor=selected.startsWith(path+'/');
  return <li key={path} className={`arc-explorer-node ${ancestor?'on-path':''}`} data-tone={entry.tone} data-open={folder&&open?'true':undefined} style={{'--tree-depth':depth} as CSSProperties}><button className={`arc-explorer-row ${folder?'is-folder':'is-file'} ${active?'is-current':''}`} aria-expanded={folder?open:undefined} aria-current={active?'page':undefined} onClick={()=>folder?toggle(path):onSelect(path)} onKeyDown={event=>keyboard(event,folder,open,path)}><span className={`arc-explorer-marker ${folder&&open?'is-open':''}`} aria-hidden="true"/><span className="arc-explorer-name">{entry.name}</span>{folder&&<span className="arc-explorer-count">{entry.children!.length}</span>}</button>{folder&&open&&branch(entry.children!,path,depth+1,showAll||!!q&&entry.name.toLowerCase().includes(q))}</li>;
 })}</ul>}
 return <nav className="arc-explorer" aria-label="File explorer">{entries.some(entry=>matches(entry,q))?branch(entries):<p className="arc-explorer-empty">No matching files.</p>}</nav>;
}
