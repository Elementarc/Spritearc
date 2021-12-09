import React, { useEffect} from 'react';

export default function Loader(props: {loading: boolean}) {
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
        <div className="loading_container" id="loading_container">
            
            <div className="loader"></div>
            
        </div>
    );
}
