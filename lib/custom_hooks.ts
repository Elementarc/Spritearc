import {useEffect} from "react"

//takes the id of an image component
export function useParallax(id: string) {
    
    useEffect(() => {
        const element = document.getElementById(id) as HTMLDivElement
        
        function parallax() {
            if(element) {
                element.style.transform = `translateY(${window.scrollY / 2}px)`
            }
        }

        window.addEventListener("scroll", parallax)
        return(() => {
            window.removeEventListener("scroll", parallax)
        })
    }, [id])
}