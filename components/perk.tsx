import React from "react"

export interface IPerk {
    Icon: JSX.Element,
    title: string,
    description: string
}

export default function Perk(props: IPerk) {
    const Icon = props.Icon

    return(
        <div className="perk">
            <div className="perk_header">
                <div className="perk_icon_wrapper">
                    {Icon}
                </div>
                <h2>{props.title}</h2>
            </div>
            
            <p>{props.description}</p>
        </div>
    )
}