import React from 'react';
import DoneIcon from "../public/icons/DoneIcon.svg"

export default function CheckBox(props: {textComponent: JSX.Element, checkBox: boolean, setCheckBox: React.Dispatch<React.SetStateAction<boolean>>}) {
    const text = props.textComponent
    const checkBox = props.checkBox
    const setCheckBox = props.setCheckBox

    return (
        <div className="check_box_container">

            <div onClick={() => setCheckBox(!checkBox)} className="check_box" id="legal_check_box">
                
                { checkBox && <DoneIcon key="legal_key_svg" className="done_icon"/>}

            </div>

            {text}
            
        </div>
    );
}
