import { useViewportScroll } from "framer-motion"
import {useEffect} from "react"

export function useGradient(id: string) {
    //Setting gradiant of Specific HTML Element by id.
    useEffect(() => {
        const HTMLElement = document.getElementById(id) as HTMLDivElement
        //Gradiant always starts at top of the page.
        HTMLElement.style.background = `linear-gradient(180deg, #111F35 -${HTMLElement.offsetTop}px, #111F35 50%, #020B16 100%)`
    }, [])
}

export function useParallax(id: string) {
    //Parallax effect for backgroundImage
    const { scrollY } = useViewportScroll()
    useEffect(() => {
        const element = document.getElementById(id) as HTMLDivElement
        function parallax() {
            element.style.transform = `translateY(${scrollY.get() / 2}px)`
        }

        window.addEventListener("scroll", parallax)

        return(() => {
            window.removeEventListener("scroll", parallax)
        })
    }, [scrollY])
}