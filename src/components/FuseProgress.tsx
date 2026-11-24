import {forwardRef,type ComponentProps,type CSSProperties} from 'react';
import {fuseProgress,loader} from '../core/design';
const sizes={'1':16,'2':20,'3':28,'4':48} as const;
export type FuseProgressProps=Omit<ComponentProps<'span'>,'children'>&{
 /** Completed share, 0–100. */
 value:number;
 size?:keyof typeof sizes;
};
/** Determinate loader: the triangle route draws itself with a sizzling end as `value` rises. */
export const FuseProgress=forwardRef<HTMLSpanElement,FuseProgressProps>(({value,size='3',className,'aria-label':label='Loading',...props},ref)=>{
 const done=Math.min(Math.max(value,0),100);
 const burning=done>0&&done<100;
 const sizzle=Math.min(fuseProgress.sizzleLength,done);
 return <span {...props} ref={ref} className={['arc-fuse-progress',className].filter(Boolean).join(' ')} style={{'--fuse-size':`${sizes[size]}px`,...props.style} as CSSProperties} role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(done)}>
  <svg viewBox={fuseProgress.viewBox} fill="none" aria-hidden="true">
   <path d={loader.route} pathLength="100" strokeWidth={fuseProgress.strokeWidth} strokeDasharray={`${done} 200`}/>
   {burning&&<g className="arc-fuse-sizzles">
    <path className="arc-fuse-sizzle" d={loader.route} pathLength="100" strokeWidth={fuseProgress.strokeWidth} strokeDasharray={`${sizzle} 200`} strokeDashoffset={sizzle-done}/>
    <path className="arc-fuse-sizzle arc-fuse-sizzle-tip" d={loader.route} pathLength="100" strokeWidth={fuseProgress.strokeWidth} strokeDasharray={`${sizzle/2} 200`} strokeDashoffset={sizzle/2-done}/>
   </g>}
  </svg>
 </span>;
});
FuseProgress.displayName='ArcubicFuseProgress';
