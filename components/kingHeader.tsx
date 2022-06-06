import React from 'react';

export default function KingHeader(props: {title: string}) {
    const title = props.title

    return (
        <div className="king_header_container">
            <div className="left_container">
                <span className="left_line"/>
                <div className="left_icon"/>
            </div>
            
            <h1 className='big' id="h1_with_deco">{title}</h1>

            <div className="right_container">
                <div className="right_icon"/>
                <span className="right_line"/>
            </div>
        </div>
    );
}
