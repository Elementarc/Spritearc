import {useEffect} from "react"


export function useGradient(id: string) {
    //Setting gradiant of Specific HTML Element by id.
    useEffect(() => {
        const HTMLElement = document.getElementById(id) as HTMLDivElement

        HTMLElement.style.background = `linear-gradient(180deg, #111F35 -${HTMLElement.offsetTop}px, #051020 10000px)`
    }, [])
}