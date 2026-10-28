import {forwardRef,type ComponentProps} from 'react';
import {Switch as RadixSwitch} from '@radix-ui/themes';
export type DirectionSwitchProps = ComponentProps<typeof RadixSwitch>;
/** Arcubic's proportionally scaled sliding triangle switch. */
export const DirectionSwitch = forwardRef<HTMLButtonElement,DirectionSwitchProps>((props,ref)=><RadixSwitch {...props} ref={ref}/>);
DirectionSwitch.displayName='DirectionSwitch';
