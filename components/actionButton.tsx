import React from "react";

//Compontent that represents an icon for the pack navigation
export default function Action_button({Icon, label, positive, onClickFunc}: {Icon: any, label: string, positive: boolean, onClickFunc: ()=>void}) {
    return (
        <div className={`action_button_container ${positive ? 'positive' : 'negative'}`}>
            <div style={positive ? {order: "0"} : {order: "1"}} className={`action_button`} onClick={onClickFunc}>
                <Icon/>
            </div>
            <p className="action_label">{label}</p>
        </div>
    );
}