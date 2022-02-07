import React, {useContext, useState, useEffect} from 'react';
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Link from 'next/link';
import { Auth_context } from '../context/auth_context_provider';
import { useRouter } from 'next/router';
import { USER_DISPATCH_ACTIONS } from '../context/auth_context_provider';
import Loader from '../components/loading';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider';
import { Nav_shadow } from '../components/navigation';
import { App_notification_context_type, Auth_context_type, Public_user } from '../types';
import Head from 'next/head';

export default function Login_page_handler() {
    const [user_logged_in, set_user_logged_in] = useState<null | boolean>(null)
    const router = useRouter()

    useEffect(() => {
        function check_auth() {
            const user_token = sessionStorage.getItem("user") ? sessionStorage.getItem("user") : ""
            if(user_token) { 
                router.push("/account", "/account", {scroll: false})
                return set_user_logged_in(true)
            } else {
                return set_user_logged_in(false)
            }
        }
        check_auth()
    }, [])
    const Auth: Auth_context_type = useContext(Auth_context)
    const App_notification: App_notification_context_type = useContext(App_notification_context)

    return(
        <>
            {user_logged_in === false &&
                <Login_page Auth={Auth} App_notification={App_notification}/>
            }
            
        </>
    )
}

export function Login_page(props: { Auth: Auth_context_type, App_notification: App_notification_context_type}) {
    const [loading, set_loading] = useState(false)
    const router = useRouter()
    const App_notification = props.App_notification
    const Auth = props.Auth
    
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
                    "Content-Type": "application/json",
                    "x-access-token": `${sessionStorage.getItem("user") ? sessionStorage.getItem("user") : ""}`
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email_input.value,
                    password: password_input.value
                })
            })

            if(response.status === 200) {

                const body = await response.json() as {public_user: Public_user, token: string}
                
                Auth.dispatch({type: USER_DISPATCH_ACTIONS.LOGIN, payload: {auth: true, public_user: {...body.public_user}, token: body.token, callb: () => {router.push("/account", "/account", {scroll: false})}}})
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
        <>
            <Head>
				<title>{`Spritearc - Login`}</title>
				<meta name="description" content={`Login into your account to rate Pixelart packs or to create your own unqiue packs that can be shared throughout the world.`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Login`}/>
				<meta property="og:description" content={`Login into your account to rate Pixelart packs or to create your own unqiue packs that can be shared throughout the world.`}/>
				<meta property="og:image" content={``}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Login`}/>
				<meta name="twitter:description" content={`Login into your account to rate Pixelart packs or to create your own unqiue packs that can be shared throughout the world.`}/>
				<meta name="twitter:image:src" content={`/images/wallpaper.png`}/>
            </Head>
        
            <div className="login_page">

                <div className="content">
                    <Nav_shadow/>
                    <div className="login_container">
                        <H1_with_deco title="Sign In" />
                        
                        <input type="text" placeholder="Email" id="email_input"/>
                        <input type="password" placeholder="Password" id="password_input"/>
                        <button onClick={login}>
                            <p style={loading ? {opacity: 0} : {opacity: 1}}>Sign In</p>
                            {loading ? <Loader loading={loading} main_color={false} scale={1}/> : null}
                        </button>

                        <div className="forward_container">

                            <span className="bottom_section_line" />
                            <div className="items">
                                <p>{"Did you forget your password? "}<Link href="/forgot_password" scroll={false}>Reset Password</Link></p>
                                <p>{"Don’t have an account? "}<Link href="/signup" scroll={false}>Create Account</Link></p>
                            </div>
                            
                        </div>

                    </div>

                </div>
                <Footer />
            </div>
        </>
    );
}


