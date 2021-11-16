import React, {useEffect} from 'react';

//To work properly the components parent needs to be at the top of the page.
export default function Background_gradient(props: {id: string, page_id: string}) {
    const id = props.id
    const page_id = props.page_id
    
    //Setting gradiant of Specific HTML Element by id. Lining Up all gradients to fit to eachother.
    useEffect(() => {
        //BackgroundElement to set the gradient to.
        const background_element = document.getElementById(id) as HTMLDivElement
        //Page Element to get page.offsetheight
        const page_container = document.getElementById(page_id) as HTMLDivElement
        
        //Setting background height and bottom position correctly.
        function set_background_gradient() {
            //Background properties
            background_element.style.position ="absolute"
            background_element.style.pointerEvents = "none"
            background_element.style.zIndex = "-1"
            background_element.style.width = "100%"
            background_element.style.background = `linear-gradient(180deg, #111F35 75%, #020B16 110%)`
            
            //Getting Full Height of page
            const page_height = page_container.offsetHeight
            //Pixels available to the bottom of the page based on top position of screen
            const screen_left_pixels_to_bottom = page_height - window.innerHeight - window.scrollY
            //Checking Offset of parent container. Needs to be on the main container height.
            const top = background_element.parentElement?.offsetTop as number - window.scrollY
            
            background_element.style.height = `${window.innerHeight}px`
            background_element.style.maxHeight = `${page_height}px`
            background_element.style.transform = `translateY(${-top}px)`
        }

        //Observing App_container to always redo Gradient when main app_content changes
        const observerObj = new ResizeObserver((entries) => {
            set_background_gradient()
        })
        
        observerObj.observe(page_container)
        window.addEventListener("scroll", set_background_gradient)
        window.addEventListener("resize", set_background_gradient)
        return(() => {
            observerObj.unobserve(page_container)
            window.removeEventListener("resize", set_background_gradient)
            window.removeEventListener("scroll", set_background_gradient)
        })

    }, [id, page_id])

    return (
        <div id={id} />
    );
}
