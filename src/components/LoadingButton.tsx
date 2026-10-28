import {forwardRef,type ComponentProps} from 'react';
import {Button as RadixButton,IconButton as RadixIconButton,VisuallyHidden} from '@radix-ui/themes';
import {Spinner} from './Spinner';
type ButtonSize=ComponentProps<typeof RadixButton>['size'];
function spinnerSize(size:ButtonSize){
 const map=(value:string)=>value==='1'?'1' as const:value==='4'?'3' as const:'2' as const;
 return typeof size==='object'?Object.fromEntries(Object.entries(size).map(([key,value])=>[key,map(value)])):map(size||'2');
}
export const Button=forwardRef<HTMLButtonElement,ComponentProps<typeof RadixButton>>(({loading=false,children,disabled,className,...props},ref)=><RadixButton {...props} ref={ref} className={[className,loading?'rt-loading':undefined].filter(Boolean).join(' ')} loading={false} disabled={loading||disabled} aria-busy={loading||undefined}>{loading?<><span style={{visibility:'hidden'}} aria-hidden="true">{children}</span><VisuallyHidden>{children}</VisuallyHidden><span className="arc-button-loader"><Spinner size={spinnerSize(props.size)} aria-hidden="true"/></span></>:children}</RadixButton>);
Button.displayName='ArcubicButton';
export const IconButton=forwardRef<HTMLButtonElement,ComponentProps<typeof RadixIconButton>>(({loading=false,children,disabled,className,...props},ref)=><RadixIconButton {...props} ref={ref} className={[className,loading?'rt-loading':undefined].filter(Boolean).join(' ')} loading={false} disabled={loading||disabled} aria-busy={loading||undefined}>{loading?<><span style={{visibility:'hidden'}} aria-hidden="true">{children||<span className="arc-icon-reserve"/>}</span><span className="arc-button-loader"><Spinner size={spinnerSize(props.size)} aria-hidden="true"/></span></>:children}</RadixIconButton>);
IconButton.displayName='ArcubicIconButton';
