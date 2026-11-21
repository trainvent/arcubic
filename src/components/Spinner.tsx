import {forwardRef,type ComponentProps} from 'react';
import {Box} from '@radix-ui/themes';
import {loader} from '../core/design';
import type {Spinner as RadixSpinner} from '@radix-ui/themes';
export type SpinnerProps=ComponentProps<typeof RadixSpinner>;
/** Continuous triangle fuse, shared by standalone and button loading states. */
export const Spinner=forwardRef<HTMLSpanElement,SpinnerProps>(({loading=true,size='2',children,className,style,'aria-label':label='Loading',...props},ref)=>{
 if(!loading)return children;
 const sizes=typeof size==='string'?`arc-spinner-size-${size}`:Object.entries(size).map(([breakpoint,value])=>`arc-spinner-${breakpoint}-${value}`).join(' ');
 const indicator=<Box {...props} asChild><span ref={ref} className={`arc-triangle-spinner ${sizes} ${className||''}`} style={style} role={props['aria-hidden']?undefined:'status'} aria-label={props['aria-hidden']?undefined:label}><svg viewBox={loader.viewBox} aria-hidden="true" fill="none"><path className="arc-spinner-fuse" d={loader.route} pathLength="100"/></svg></span></Box>;
 return children===undefined?indicator:<span className="arc-spinner-wrap"><span aria-hidden="true" style={{visibility:'hidden'}}>{children}</span><span className="arc-spinner-cover">{indicator}</span></span>;
});
Spinner.displayName='ArcubicSpinner';
