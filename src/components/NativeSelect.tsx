import {forwardRef,type ComponentPropsWithoutRef} from 'react';

export type NativeSelectProps = ComponentPropsWithoutRef<'select'>;
/** Native keyboard and platform menu behavior with Arcubic control styling. */
export const NativeSelect=forwardRef<HTMLSelectElement,NativeSelectProps>(function NativeSelect({className='',...props},ref){
 return <select {...props} ref={ref} className={`arc-native-select ${className}`.trim()}/>;
});
