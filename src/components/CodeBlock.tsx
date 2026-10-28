import {useState} from 'react';
import {Check,Copy} from 'lucide-react';
import {IconButton} from '@radix-ui/themes';
import {Tooltip} from './portals';
export type CodeBlockProps={code:string;language?:string;filename?:string;lineNumbers?:boolean};
export function CodeBlock({code,language='text',filename,lineNumbers=true}:CodeBlockProps){
 const [status,setStatus]=useState('');
 async function copy(){try{await navigator.clipboard.writeText(code);setStatus('Copied');setTimeout(()=>setStatus(''),1500);}catch{setStatus('Clipboard unavailable');}}
 return <div className="arc-code-block"><div className="arc-code-header"><span>{filename||language}</span><Tooltip content={status||'Copy code'}><IconButton size="1" variant="ghost" aria-label="Copy code" onClick={copy}>{status==='Copied'?<Check size={13}/>:<Copy size={13}/>}</IconButton></Tooltip></div><pre aria-label={`${language} code`}><code>{code.split('\n').map((line,i)=><span className="arc-code-line" key={i}>{lineNumbers&&<span className="arc-line-number" aria-hidden="true">{i+1}</span>}<span>{line||' '}</span></span>)}</code></pre><span className="sr-only" role="status">{status}</span></div>
}
