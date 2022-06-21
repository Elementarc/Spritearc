import { useRouter } from "next/router"
import {useEffect} from "react"

//takes the id of an image component
export function useParallax(id: string, dependency?: any) {
    const depends = dependency ? dependency : null
    
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
    }, [id, depends])
}

export const useRouting = () => {
    const router = useRouter()
    const push = (pathname: string) => {
        router.push(pathname, pathname, {scroll: false})
    }
    const replace = (pathname: string) => {
        router.replace(pathname, pathname, {scroll: false})
    }
    return {push, replace}
}
