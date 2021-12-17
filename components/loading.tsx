import React, { useEffect} from 'react';

export default function Loader(props: {loading: boolean, main_color?: boolean, scale?: number}) {
    const loading = props.loading

    useEffect(() => {
        const loading_container = document.getElementById("loading_container") as HTMLDivElement

        if(loading === false) {
            loading_container.style.opacity = "0"
        } else {
            loading_container.style.opacity = "1"
        }
        
    }, [loading])

    return (
        <div style={{transform: `scale(${props.scale ? props.scale : 1})`}} className="loading_container" id="loading_container">
            
            <div style={{borderTop: `20px solid ${props.main_color ? "#F7C35E" : "#051020"}`}} className="loader"></div>
            
        </div>
    );
}
