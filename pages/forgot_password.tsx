import React, {useContext, useState} from 'react';
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Link from 'next/link';
import { GetServerSideProps } from 'next'
import Loader from '../components/loading';
import { Nav_shadow } from '../components/navigation';
import { validate_email } from '../spritearc_lib/validate_lib';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider';
import { App_notification_context_type } from '../types';

export default function Forgot_password_page() {
    const [loading, setloading] = useState(false)
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    
    function set_error_message(message: string) {
        const error_message_text = document.getElementById("reset_password_error_message") as HTMLParagraphElement

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
                headers: {"Content-Type": "application/json"},
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
            set_error_message("Something went wrong while trying to reset you password")
            setloading(false)
        }

    }

    return (
        <div className="reset_password_page">

            <div className="content">
                <Nav_shadow/>
                <div className="reset_password_container">
                    <H1_with_deco title="Reset password" />
                    
                    <input type="text" placeholder="Email" id="email_input" defaultValue="arctale.work@gmail.com"/>
                    <p className='reset_password_error_message' id="reset_password_error_message"></p>
                    <button onClick={send_password_token}>
                        <p style={loading ? {opacity: 0} : {opacity: 1}}>Request Password Reset</p>
                        {loading ? <Loader loading={loading} main_color={false} scale={1}/> : null}
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
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async(context) => {
	const cookies = context.req.cookies
    
    if(cookies.user) {
        return {
            redirect: {
                destination: "/account",
                permanent: false,
            }
        }
    } else {
        return{
            props: {}
        }
    }
	
} 



