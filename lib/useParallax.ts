import { useViewportScroll } from "framer-motion"
import {useEffect} from "react"


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