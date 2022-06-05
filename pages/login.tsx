import React, {useContext, useState, useEffect, useRef} from 'react';
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Link from 'next/link';
import { Auth_context } from '../context/auth_context_provider';
import { useRouter } from 'next/router';
import { USER_DISPATCH_ACTIONS } from '../context/auth_context_provider';
import Loading from '../components/loading';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider';
import { Nav_shadow } from '../components/navigation';
import { App_notification_context_type, Auth_context_type, Public_user, Server_response, Server_response_login } from '../types';
import Head from 'next/head';
import VisibilityIcon from "../public/icons/VisibilityIcon.svg"
import VisibilityOffIcon from "../public/icons/VisibilityOffIcon.svg"
import MetaGenerator from '../components/MetaGenerator';
import PageContent from '../components/layout/pageContent';
import { PopupProviderContext } from '../context/popupProvider';
import Button from '../components/button';


export default function PageRenderer() {
    const Auth: Auth_context_type = useContext(Auth_context)

    return (
        <>
            <MetaGenerator 
                title='Spritearc - Login'
                description='Sign into your spritearc.com account to rate and publish pixel art packs.'
                url='https://Spritearc.com/login'
                imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
            />

            <MemoLoginPage Auth={Auth} />

            <Footer/>
        </>
    );
}


export function LoginPage(props: { Auth: Auth_context_type}) {
    const [loading, set_loading] = useState(false)
    const popupContext = useContext(PopupProviderContext)
    const [password_visibility, set_password_visibility] = useState(false)
    const refs = useRef<any>([])
    const buttonRef = useRef<null | HTMLButtonElement>(null)
    const router = useRouter()
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
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email_input.value,
                    password: password_input.value
                })
            })

            const response_obj = await response.json() as Server_response_login
            const email = response_obj.email
            const public_user = response_obj.public_user
            
            if(response.status === 403) {
                set_loading(false)
                popupContext?.setPopup({
                    title: "Banned!",
                    message: "You're banned! Please contact an admin for more informations.",
                    buttonLabel: "Ok",
                    success: false
                })
                return
            }

            if(!response_obj.success) {
                set_loading(false)
                popupContext?.setPopup({
                    title: "Wrong Credentials",
                    message: "We couldn't find any match for your credentials",
                    buttonLabel: "Ok",
                    success: false,
                    buttonOnClick: () => {refs.current["email"].focus(), popupContext.setPopup(null)},
                })
                return
            } 

            if(response_obj.verified === false) {
                if(!email) {
                    popupContext?.setPopup({
                        title: "Something went wrong!",
                        message: "Something went wrong while trying to log you in. Please try again later.",
                        buttonLabel: "Retry",
                        success: false,
                        buttonOnClick: () => {refs.current["email"].focus(); popupContext.setPopup(null)},
                    })
                    return
                }
                
                popupContext?.setPopup({
                    title: "Please confirm your email!",
                    message: "You have to confirm your email address to be able to log into your account!",
                    buttonLabel: "Send confirmation",
                    success: false,
                    buttonOnClick: () => {resend_email_verification(email); refs.current["email"].focus(); popupContext.setPopup(null)}
                })
                set_loading(false)
                return
            }

            if(!public_user) return 
            
            Auth.dispatch({type: USER_DISPATCH_ACTIONS.LOGIN, payload: {auth: true, public_user: {...public_user}, callb: () => {router.push("/account", "/account", {scroll: false})}}})
            set_loading(false)

        } catch ( err ) {
            //Couldnt reach server
        }
    }

    function keyPressFunc(e: any) {
        if(document.activeElement === refs.current["email"] || document.activeElement == refs.current["password"]) {
                
            if(e.keyCode !== 13) return
            refs.current["email"].blur()
            refs.current["password"].blur()
        }
    }
    //Eventlistener to login when pressing enter
    useEffect(() => {
        /* let timer: any
        function click_login_button(e: any) {
            
            if(document.activeElement === refs.current["email"] || document.activeElement == refs.current["password"]) {
                
                if(e.keyCode !== 13) return
                refs.current["email"].blur()
                refs.current["password"].blur()
            }
        }

        window.addEventListener("keyup", click_login_button)
        return(() => {
            window.removeEventListener("keyup", click_login_button)
            clearTimeout(timer)
        }) */
    }, [])

    function toggle_password_type() {
        if(refs.current["password"].type === "password") {
            refs.current["password"].type = "text"
            set_password_visibility(true)
        } else {
            refs.current["password"].type = "password"
            set_password_visibility(false)
        }
    }

    function keyUpCondition(e: any) {
        if(document.activeElement === refs.current["email"] || document.activeElement == refs.current["password"]) {
            if(e.keyCode !== 13) return false
            refs.current["email"].blur()
            refs.current["password"].blur()

            return true
        } else {
            return false
        }
    }
    return (
        <PageContent>
            
            <div className="login_container">
                <H1_with_deco title="Sign In" />
                
                <input ref={(el) => {return refs.current["email"] = el}} type="text" placeholder="Email" id="email_input"/>
                
                <div className='password_input_container'>
                    <input ref={(el) => {return refs.current["password"] = el}} type="password" placeholder="Password" id="password_input"/>
                    
                    {!password_visibility &&
                        <div onClick={toggle_password_type} className='password_visibility_icon_container'>
                            <VisibilityOffIcon/>
                        </div>
                    }
                    {password_visibility &&
                        <div onClick={toggle_password_type} className='password_visibility_icon_container'>
                            <VisibilityIcon/>
                        </div>
                    }
                    
                </div>

                <Button clickWithEnter={true} containerClassName='login_button' onClick={() => login()} btnClassName='primary default' btnLabel='Login' loading={loading} />
                <div className="forward_container">

                    <span className="bottom_section_line" />
                    <div className="items">
                        <p>{"Did you forget your password? "}<Link href="/forgot_password" scroll={false}>Reset Password</Link></p>
                        <p>{"Don’t have an account? "}<Link href="/signup" scroll={false}>Create Account</Link></p>
                    </div>
                    
                </div>

            </div>

        </PageContent>
    );
}
export const MemoLoginPage = React.memo(LoginPage)

