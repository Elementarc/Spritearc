import {useEffect} from "react"

//takes the id of an image component
export function useParallax(id: string, dependency?: any) {
    
    useEffect(() => {
        const element = document.getElementById(id) as HTMLDivElement
        
        function parallax() {
            if(element) {
                //element.style.transform = `translateY(${window.scrollY / 2}px)`
                element.style.objectPosition = `50% calc(50% + ${window.scrollY / 2}px)`
            }
        }

        window.addEventListener("scroll", parallax)
        return(() => {
            window.removeEventListener("scroll", parallax)
        })
    }, [id, dependency ? dependency : null])
}

