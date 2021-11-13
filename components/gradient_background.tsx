import React, {useEffect} from 'react';

export default function Background_gradient(props: {id: string}) {
    const id = props.id
    //Setting gradiant of Specific HTML Element by id. Lining Up all gradients to fit to eachother.
    useEffect(() => {
        const HTMLElement = document.getElementById(id) as HTMLDivElement
        const app_content = document.getElementById("app_content_container") as HTMLDivElement
        //Setting background height and bottom position correctly.
        function set_background_position() {
            //Background properties
            HTMLElement.style.position ="absolute"
            HTMLElement.style.pointerEvents = "none"
            HTMLElement.style.zIndex = "-1"
            HTMLElement.style.width = "100%"
            HTMLElement.style.background = `linear-gradient(180deg, #111F35 75%, #020B16 110%)`
            
            //Getting Full Height of page
            const page_height = app_content.offsetHeight
            console.log(page_height)
            //Pixels available to the bottom of the page based on top position of screen
            const screen_left_pixels_to_bottom = page_height - window.innerHeight - window.scrollY
            //Checking Offset of parent container. Needs to be on the main container height.
            const top = HTMLElement.parentElement?.offsetTop as number - window.scrollY
            
            HTMLElement.style.height = `${window.innerHeight}px`
            HTMLElement.style.maxHeight = `${page_height}px`
            HTMLElement.style.top = `${-top}px`
        }
        //Observing App_container to always 
        const observerObj = new ResizeObserver((entries) => {
            set_background_position()
            
        })
        observerObj.observe(app_content)
        
        
        window.addEventListener("scroll", set_background_position)
        return(() => {
            observerObj.unobserve(app_content)
            window.removeEventListener("scroll", set_background_position)
        })

    }, [id])
    return (
        <div id={id}></div>
    );
}
