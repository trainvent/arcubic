import {forwardRef,useLayoutEffect,useRef,type ComponentProps} from 'react';
import {IconButton as RadixIconButton} from '@radix-ui/themes';
import {syncTrace} from '../core/design';
const {dash,durationSeconds}=syncTrace;
const dashLength=dash*100;
const iconSize={'1':16,'2':20,'3':24,'4':28} as const;
export type SyncButtonProps=Omit<ComponentProps<typeof RadixIconButton>,'children'>;
/** Icon button whose glyph is the first frame of the Continuous trace. While `loading`, the
 * trace runs from that frame, so the icon turns into the loader without a jump. */
export const SyncButton=forwardRef<HTMLButtonElement,SyncButtonProps>(({loading=false,disabled,size='2',className,...props},ref)=>{
 const svg=useRef<SVGSVGElement>(null);
 useLayoutEffect(()=>{
  const timeline=svg.current;
  if(!timeline?.setCurrentTime)return;
  timeline.setCurrentTime(0);
  if(loading)timeline.unpauseAnimations();else timeline.pauseAnimations();
 },[loading]);
 const pixels=typeof size==='string'?iconSize[size]:iconSize['2'];
 return <RadixIconButton {...props} ref={ref} size={size} className={[className,'arc-sync-button',loading?'arc-sync-running':undefined].filter(Boolean).join(' ')} loading={false} disabled={loading||disabled} aria-busy={loading||undefined}>
  <svg ref={svg} className="arc-sync-trace" width={pixels} height={pixels} viewBox={syncTrace.viewBox} fill="none" aria-hidden="true">
   <path className="arc-sync-full" d={syncTrace.route} strokeWidth={syncTrace.strokeWidth}/>
   <g className="arc-sync-moving">
    <path d={syncTrace.route} pathLength="100" strokeWidth={syncTrace.strokeWidth} strokeDasharray={`${dashLength} ${100-dashLength}`} strokeDashoffset="100">
     <animate attributeName="stroke-dashoffset" from="100" to="0" dur={`${durationSeconds}s`} repeatCount="indefinite"/>
    </path>
    <polygon points={syncTrace.arrow} fill="currentColor" stroke="none">
     <animateMotion path={syncTrace.route} rotate="auto" calcMode="linear" keyPoints={`${dash};1;0;${dash}`} keyTimes={`0;${1-dash};${1-dash};1`} dur={`${durationSeconds}s`} repeatCount="indefinite"/>
    </polygon>
   </g>
  </svg>
 </RadixIconButton>;
});
SyncButton.displayName='ArcubicSyncButton';
