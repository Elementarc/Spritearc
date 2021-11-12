import { useViewportScroll } from "framer-motion"
import {useEffect} from "react"

export function useGradient(id: string) {
    //Setting gradiant of Specific HTML Element by id. Lining Up all gradients to fit to eachother
    useEffect(() => {
        const HTMLElement = document.getElementById(id) as HTMLDivElement
        const app_content = document.getElementById("app_content_container") as HTMLDivElement
        //Background properties
        HTMLElement.style.position ="absolute"
        HTMLElement.style.pointerEvents = "none"
        HTMLElement.style.zIndex = "-1"
        HTMLElement.style.width = "100%"
        HTMLElement.style.background = `linear-gradient(180deg, #111F35 74%, #020B16 100%)`

        //Setting background height and bottom position correctly.
        function setHeight() {
            //Getting Full Height of page
            const page_height = app_content.offsetHeight
            //Pixels available to the bottom of the page based on top position of screen
            const screen_left_pixels_to_bottom = page_height - window.innerHeight - window.scrollY
            //Pixels Left after screen height to bottom.
            const screen_top_to_bottom_page_height = screen_left_pixels_to_bottom + window.innerHeight
            //How many pixels Element has left to page bottom
            const ElementLeftToBottom = (HTMLElement.parentElement?.offsetTop as any + HTMLElement.parentElement?.offsetHeight as any) - page_height
            


            HTMLElement.style.height = `${screen_left_pixels_to_bottom + window.innerHeight}px`
            HTMLElement.style.bottom = `${ElementLeftToBottom}px`
        }
        setHeight()
        window.addEventListener("scroll", setHeight)
        return(() => {
            window.removeEventListener("scroll", setHeight)
        })

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