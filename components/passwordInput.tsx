import React, {forwardRef, useEffect, useRef, useState} from 'react';
import VisibilityIcon from "../public/icons/VisibilityIcon.svg"
import VisibilityOffIcon from "../public/icons/VisibilityOffIcon.svg"

export default function PasswordInput(props: {defaultValue?: string, type?: string, placeholder?: string, onKeyUp?: () => void, className?: string, refCallb: (el: HTMLInputElement|null) => void}) {
    const [showPassword, setShowPassword] = useState(false)
    const passwordInputRef = useRef<HTMLInputElement | null>(null)
    const refCallback = props.refCallb

    if(!passwordInputRef) return null
    
    useEffect(() => {
        if(!passwordInputRef.current) return

        if(showPassword) {
            
            passwordInputRef.current.type = "text"
        } else {
            passwordInputRef.current.type = "password"
        }
    }, [showPassword, passwordInputRef])

    return (
        <div className='password_input_container'>
            <input 
                onKeyUp={props.onKeyUp ? props.onKeyUp : () => {}}
                className={`${props.className}`} 
                placeholder={props.placeholder ?? ""}
                type={props.type ?? "text"}
                defaultValue={props.defaultValue ? props.defaultValue : ""}
                ref={(el) => {
                    refCallback(el);
                    passwordInputRef.current = el
                }}

            />
            <div className='icon_container'>
                <div onClick={() => setShowPassword(!showPassword)} className='icon_wrapper'>
                    {showPassword && <VisibilityOffIcon/>} 
                    {!showPassword && <VisibilityIcon/>} 
                </div>
            </div>
        </div>
    );
}
