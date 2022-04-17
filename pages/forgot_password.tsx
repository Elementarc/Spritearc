import React, {useContext, useState} from 'react';
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Link from 'next/link';
import Loading from '../components/loading';
import { Nav_shadow } from '../components/navigation';
import { validate_email } from '../spritearc_lib/validate_lib';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider';
import { App_notification_context_type } from '../types';
import Head from 'next/head';

export default function Forgot_password_page() {
    const [loading, setloading] = useState(false)
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    
    function set_error_message(message: string) {
        const error_message_text = document.getElementById("forgot_password_error_message") as HTMLParagraphElement
        if(!error_message_text) return
        error_message_text.innerText = message
    }

    async function send_password_token() {
        setloading(true)
        const email_input = document.getElementById("email_input") as HTMLInputElement
        const valid_email = validate_email(email_input.value)

        if(typeof valid_email === "string") return set_error_message(valid_email)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/forgot_password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: email_input.value})
            })

            const response_obj = await response.json() as {success: boolean, message: string}
            if(!response_obj.success) {
                setloading(false)
                return set_error_message(response_obj.message)
            }

            App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Please visit your email", message: "We have sent you an email with further instructions to reset your password.", button_label: "Ok"}})
            setloading(false)
            return set_error_message("")

        } catch(err) {
            //Couldnt reach server
        }

    }

    return (
        <>
            <Head>
				<title>{`Spritearc - Forgot Password`}</title>
				<meta name="description" content={`Request a password token that will enable you to reset your password by providing us your email.`}/>
				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Forgot Password`}/>
				<meta property="og:description" content={`Request a password token that will enable you to reset your password by providing us your email.`}/>
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Forgot Password`}/>
				<meta name="twitter:description" content={`Request a password token that will enable you to reset your password by providing us your email.`}/>
                <meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>
            </Head>
        
            <div className="forgot_password_content">
                <Nav_shadow/>
                <div className="forgot_password_container">
                    <H1_with_deco title="Reset password" />
                    
                    <input type="text" placeholder="Email" id="email_input" defaultValue=""/>
                    <p className='forgot_password_error_message' id="forgot_password_error_message"></p>
                    <button onClick={send_password_token}>
                        <p style={loading ? {opacity: 0} : {opacity: 1}}>Request Password Reset</p>
                        {loading ? <Loading loading={loading} main_color={false} scale={1}/> : null}
                    </button>

                    <div className="forward_container">

                        <span className="bottom_section_line" />
                        <div className="items">
                            <p>{"Already have an account? "}<Link href="/login" scroll={false}>Login</Link></p>
                            <p>{"Don’t have an account? "}<Link href="/signup" scroll={false}>Create Account</Link></p>
                        </div>
                        
                    </div>

                </div>

            </div>
            <Footer />
        </>
    );
}




