import React, {useContext, useState} from 'react';
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Link from 'next/link';
import { GetServerSideProps } from 'next'
import { Auth_context } from '../context/auth_context_provider';
import { useRouter } from 'next/router';
import { USER_DISPATCH_ACTIONS } from '../context/auth_context_provider';
import Loader from '../components/loading';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider';
import { Nav_shadow } from '../components/navigation';
import { App_notification_context_type, Auth_context_type, Public_user } from '../types';

export default function Login_page() {
    const [loading, set_loading] = useState(false)
    
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    const Auth: Auth_context_type = useContext(Auth_context)
    const router = useRouter()
    
    async function resend_email_verification(email: string) {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/resend_email_confirmation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    credentials: "include",
                    email: email
                })
            })
        } catch(err) {
            //Couldnt reach server
        }
        
    }

    async function login() {
        set_loading(true)
        const email_input = document.getElementById("email_input") as HTMLInputElement
        const password_input = document.getElementById("password_input") as HTMLInputElement

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email_input.value,
                    password: password_input.value
                })
            })

            if(response.status === 200) {

                const body = await response.json() as Public_user
                
                console.log(body)
                
                Auth.dispatch({type: USER_DISPATCH_ACTIONS.LOGIN, payload: {auth: true, public_user: {...body}, callb: () => {router.push("/account", "/account", {scroll: false})}}})
                
                console.log("Successfully logged in")
                set_loading(false)

                
            } 
            //Account needs to be verified
            else if(response.status === 401) {
                const body = await response.json()
                
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Please confirm your email!", message: "You have to confirm your email address to be able to login!", button_label: "Send confirmation", callb: () => {resend_email_verification(body.email)}}})
                set_loading(false)

            } else  {
                set_loading(false)
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Wrong Credentials", message: "We couldn't find any match for your credentials", button_label: "ok"}})
            }

        } catch ( err ) {
            //Couldnt reach server
        }
    }

    return (
        <div className="login_page">

            <div className="content">
                <Nav_shadow/>
                <div className="login_container">
                    <H1_with_deco title="Sign In" />
                    
                    <input type="text" placeholder="Email" id="email_input" defaultValue="arctale.work@gmail.com"/>
                    <input type="password" placeholder="Password" id="password_input" defaultValue="Hurrensohn1"/>
                    <button onClick={login}>
                        <p style={loading ? {opacity: 0} : {opacity: 1}}>Sign In</p>
                        {loading ? <Loader loading={loading} main_color={false} scale={1}/> : null}
                    </button>

                    <div className="forward_container">

                        <span className="bottom_section_line" />
                        <div className="items">
                            <p>{"Did you forget your password? "}<Link href="/signup" scroll={false}>Reset Password</Link></p>
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



