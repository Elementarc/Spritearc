import { useViewportScroll } from "framer-motion"
import {useEffect} from "react"


export function createParallaxByElementId(id: string) {
    //Parallax effect for backgroundImage
    const { scrollY } = useViewportScroll()
    useEffect(() => {
        const getPatchImageContainer = document.getElementById(id) as HTMLDivElement
        function parallax() {
            getPatchImageContainer.style.transform = `translateY(${scrollY.get() / 2}px)`
        }

        window.addEventListener("scroll", parallax)

        return(() => {
            window.removeEventListener("scroll", parallax)
        })
    }, [scrollY])
}