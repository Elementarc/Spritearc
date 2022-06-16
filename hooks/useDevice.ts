import { useEffect, useState } from 'react';
import { EBreakpoints } from '../lib/breakpoints';

export enum EDevice {
    MOBILE = 'mobile',
    DESKTOP = 'desktop'
}

export default function useDevice(): EDevice | null {
  const [device, setDevice] = useState<null | EDevice>(null)

    useEffect(() => {
        
        const observer = new ResizeObserver(() => {
            if(window.innerWidth <= EBreakpoints.MOBILE) setDevice(EDevice.MOBILE)
            else setDevice(EDevice.DESKTOP)
        })
        
        observer.observe(document.body)
        return() => {
            observer.unobserve(document.body)
        }
    }, [device])

    return device
}
