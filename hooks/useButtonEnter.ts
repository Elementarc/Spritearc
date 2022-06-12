import React, {useEffect} from "react";


export default function useButtonEnter(ButtonElement: React.MutableRefObject<HTMLButtonElement | null>, checkFunc?: () => boolean): void {

    useEffect(() => {
        const button = ButtonElement.current
        if(!button) return
        
        const onKeyUp = (e:any) => {
            if(document.activeElement === button) return
            const rect = button.getBoundingClientRect()
            if(!rect) return
            if(rect.top <= 120 && rect.bottom <=120) return
            if(e.keyCode !== 13) return
            let allow = true
            if( checkFunc ) allow = checkFunc();

            if(!allow) return
        
            ButtonElement.current?.click()
        }

        window.addEventListener("keyup", onKeyUp)
        return() => {
            window.removeEventListener("keyup", onKeyUp)
        }
    }, [ButtonElement])

}
