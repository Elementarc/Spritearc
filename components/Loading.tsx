import React, { useState , useEffect} from 'react';

export default function Loading_handler(props: {button_label: string, init_loading: boolean}) {
    const button_label = props.button_label

    useEffect(() => {
        const loading_container = document.getElementById("loading_container") as HTMLDivElement
        const button_label = document.getElementById("button_label") as HTMLDivElement

        if(props.init_loading === false) {
            button_label.style.opacity = "1"
            loading_container.style.opacity = "0"
        } else {
            button_label.style.opacity = "0"
            loading_container.style.opacity = "1"
        }
        
    }, [props.init_loading])

    return (
        <>

            <div className="loading_container" id="loading_container">
                
                <div className="loader"></div>
                
            </div>

            <div className="button_label" id="button_label">
                {button_label}
            </div>

        </>
    );
}
