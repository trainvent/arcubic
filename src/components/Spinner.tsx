import {forwardRef,type ComponentProps} from 'react';
import {Box} from '@radix-ui/themes';
import type {Spinner as RadixSpinner} from '@radix-ui/themes';
export type SpinnerProps=ComponentProps<typeof RadixSpinner>;
// Triangle portion of the user's Le Logo continuous fuse route (no enclosing circle).
const route='M450 9.45 L548.3474 179.7927 L831.5275 670.275 L634.8327 670.275 L68.4725 670.275 L166.8199 499.9323 L514.1917 626.3653 L634.8327 670.275 L570.641 306.2257 L548.3474 179.7927 L265.1673 417.409 L343.9101 388.749 L570.641 306.2257 L556.0899 388.749 L514.1917 626.3653 L450 572.502 L556.0899 388.749 L343.9101 388.749 L450 572.502 L265.1673 417.409 L166.8199 499.9323 L450 9.45';
/** Continuous triangle fuse, shared by standalone and button loading states. */
export const Spinner=forwardRef<HTMLSpanElement,SpinnerProps>(({loading=true,size='2',children,className,style,'aria-label':label='Loading',...props},ref)=>{
 if(!loading)return children;
 const sizes=typeof size==='string'?`arc-spinner-size-${size}`:Object.entries(size).map(([breakpoint,value])=>`arc-spinner-${breakpoint}-${value}`).join(' ');
 const indicator=<Box {...props} asChild><span ref={ref} className={`arc-triangle-spinner ${sizes} ${className||''}`} style={style} role={props['aria-hidden']?undefined:'status'} aria-label={props['aria-hidden']?undefined:label}><svg viewBox="20 -40 860 760" aria-hidden="true" fill="none"><path className="arc-spinner-guide" d={route}/><path className="arc-spinner-fuse" d={route} pathLength="100"/></svg></span></Box>;
 return children===undefined?indicator:<span className="arc-spinner-wrap"><span aria-hidden="true" style={{visibility:'hidden'}}>{children}</span><span className="arc-spinner-cover">{indicator}</span></span>;
});
Spinner.displayName='ArcubicSpinner';
