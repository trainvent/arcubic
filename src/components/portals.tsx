import {createContext,useContext,useState,forwardRef,createElement,type ComponentProps,type ForwardRefExoticComponent,type RefAttributes} from 'react';
import * as R from '@radix-ui/themes';
type Container = ComponentProps<typeof R.Dialog.Content>['container'];
const OverlayHost=createContext<Container>(undefined);
/** Keep portal content inside the active Arcubic theme so tokens and accent inherit. */
export const Theme=forwardRef<HTMLDivElement,ComponentProps<typeof R.Theme>>(({children,...props},ref)=>{
 const [host,setHost]=useState<HTMLDivElement|null>(null);
 return <R.Theme {...props} ref={ref}><OverlayHost.Provider value={host??undefined}>{children}<div ref={setHost} className="arcubic-overlay-host"/></OverlayHost.Provider></R.Theme>;
});
Theme.displayName='ArcubicTheme';
function portaled<P extends {container?:Container}>(Component:ForwardRefExoticComponent<P & RefAttributes<HTMLDivElement>>){
 return forwardRef<HTMLDivElement,P>((props,ref)=>{
  const host=useContext(OverlayHost);
  return createElement(Component,{...props,ref,container:props.container??host} as P & RefAttributes<HTMLDivElement>);
 });
}
export const Dialog={...R.Dialog,Content:portaled(R.Dialog.Content)};
export const AlertDialog={...R.AlertDialog,Content:portaled(R.AlertDialog.Content)};
export const Popover={...R.Popover,Content:portaled(R.Popover.Content)};
export const HoverCard={...R.HoverCard,Content:portaled(R.HoverCard.Content)};
export const Select={...R.Select,Content:portaled(R.Select.Content)};
export const DropdownMenu={...R.DropdownMenu,Content:portaled(R.DropdownMenu.Content),SubContent:portaled(R.DropdownMenu.SubContent)};
export const ContextMenu={...R.ContextMenu,Content:portaled(R.ContextMenu.Content),SubContent:portaled(R.ContextMenu.SubContent)};
export const Tooltip=portaled(R.Tooltip);
