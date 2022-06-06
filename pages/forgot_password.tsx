import React, {useContext, useRef, useState} from 'react';
import Footer from '../components/footer';
import Link from 'next/link';
import { validate_email } from '../spritearc_lib/validate_lib';
import { PopupProviderContext } from '../context/popupProvider';
import MetaGenerator from '../components/MetaGenerator';
import PageContent from '../components/layout/pageContent';
import ForwardContainer from '../components/forwardContainer';
import Button from '../components/button';
import KingHeader from '../components/kingHeader';
import apiCaller from '../lib/apiCaller';


export default function PageRenderer() {
    return (
        <>
            <MetaGenerator
                title='Spritearc - Forgot Password'
                description='Request a password token that will enable you to reset your password by providing us your email.'
                imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
                url="https://Spritearc.com/forgot_password"
            />

            <ForgotPasswordPage/>

            <Footer/>
        </>
    );
}

function ForgotPasswordPage() {
    const emailInputRef = useRef<null | HTMLInputElement>(null)
    const messageRef = useRef<null | HTMLParagraphElement>(null)
    const [loading, setloading] = useState(false)
    const abortControllerRef = useRef(new AbortController())
    const popupContext = useContext(PopupProviderContext)

    function set_error_message(message: string) {
        if(!messageRef.current) return
        messageRef.current.innerText = message
    }

    async function send_password_token() {
        const emailValue = emailInputRef.current?.value.trim()
        if(!emailValue) return
        const valid_email = validate_email(emailValue)
        if(typeof valid_email === "string") return set_error_message(valid_email)

        setloading(true)
        await apiCaller.forgotPassword(emailValue, abortControllerRef.current.signal)
        
        popupContext?.setPopup({
            success: true,
            title: "Success!",
            message: "If there is an exisiting account with that email then we have send an password reset link.",
            buttonLabel: "Okay",
        })
        setloading(false)
        return set_error_message("")

    }

    return (
        <PageContent>
            <div className="forgot_password_content">
                <div className="forgot_password_container">
                    <KingHeader title="Reset password" />
                    
                    <div className='input_container'>
                        <input ref={(el) => {emailInputRef.current = el}} className='big' type="text" placeholder="What's your account E-mail?"/>
                        <p ref={(el) => messageRef.current = el} className='error' id="forgot_password_error_message"></p>
                    </div>

                    <div className='button_wrapper'>
                        <Button clickWithEnter={true} className='primary default' onClick={send_password_token} btnLabel='Request Password Reset' loading={loading}/>
                    </div>

                    <div className="forward_wrapper">

                        <ForwardContainer
                            componentsArr={[
                                <p key={"Key 1"}>{"Already have an account? "}<Link href="/login" scroll={false}>Login</Link></p>,
                                <p key={"Key 2"}>{"Don't have an account? "}<Link href="/signup" scroll={false}>Create Account</Link></p>
                            ]}
                        />
                        
                    </div>

                </div>
            </div>
        </PageContent>
    );
}




