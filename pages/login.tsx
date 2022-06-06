import React, {useContext, useState, useEffect, useRef} from 'react';
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Link from 'next/link';
import { Auth_context } from '../context/auth_context_provider';
import { useRouter } from 'next/router';
import { USER_DISPATCH_ACTIONS } from '../context/auth_context_provider';
import { Auth_context_type, Public_user, Server_response, Server_response_login } from '../types';
import Head from 'next/head';
import VisibilityIcon from "../public/icons/VisibilityIcon.svg"
import VisibilityOffIcon from "../public/icons/VisibilityOffIcon.svg"
import MetaGenerator from '../components/MetaGenerator';
import PageContent from '../components/layout/pageContent';
import { PopupProviderContext } from '../context/popupProvider';
import Button from '../components/button';
import PasswordInput from '../components/passwordInput';
import apiCaller from '../lib/apiCaller';
import ForwardContainer from '../components/forwardContainer';
import KingHeader from '../components/kingHeader';


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

            <LoginPage Auth={Auth} />

            <Footer/>
        </>
    );
}


export function LoginPage(props: { Auth: Auth_context_type}) {
    const [loading, set_loading] = useState(false)
    const popupContext = useContext(PopupProviderContext)
    const abortControllerRef = useRef(new AbortController())
    const passwordInputRef = useRef<null | HTMLInputElement>(null)
    const emailInputRef = useRef<null | HTMLInputElement>(null)
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
    function resetInputs() {
        if(!passwordInputRef.current) return
        if(!emailInputRef.current) return
        passwordInputRef.current.value = ""

        emailInputRef.current.focus()
    }
    async function login() {
        const passwordValue = passwordInputRef.current?.value
        if(!passwordValue) return
        const emailValue = emailInputRef.current?.value
        if(!emailValue) return
        
        try {
            set_loading(true)
            const response = await apiCaller.login(emailValue.trim(), passwordValue, abortControllerRef.current.signal)
            if(!response) {
                popupContext?.setPopup({
                    title: "Something went wrong!",
                    message: "Something went wrong while trying to log you in. Please try again later.",
                    buttonLabel: "Retry",
                    success: false,
                    buttonOnClick: () => {resetInputs(); popupContext.setPopup(null)},
                })
                return
            }


            const public_user = response?.public_user
            const email = response?.email
            const banned = response?.banned

            if(banned) {
                set_loading(false)
                popupContext?.setPopup({
                    title: "Banned!",
                    message: "You're banned! Please contact an admin for more informations.",
                    buttonLabel: "Ok",
                    success: false,
                    buttonOnClick: () => {resetInputs(); popupContext.setPopup(null)}

                })
                return
            }

            if(response?.verified === false) {
                set_loading(false)
                if(!email) return

                popupContext?.setPopup({
                    title: "Please confirm your email!",
                    message: "You have to confirm your email address to be able to log into your account!",
                    buttonLabel: "Send confirmation",
                    success: true,
                    buttonOnClick: () => {resend_email_verification(email); resetInputs(); popupContext.setPopup(null)}
                })
                return
            }

            if(!response.success) {
                set_loading(false)
                popupContext?.setPopup({
                    success: false,
                    title: "Failed!",
                    message: response.message,
                    buttonLabel: "Okay",
                    buttonOnClick: () => {resetInputs(); popupContext.setPopup(null)}
                })
            }
            
            

            if(!public_user) return
            Auth.dispatch({type: USER_DISPATCH_ACTIONS.LOGIN, payload: {auth: true, public_user: {...public_user}, callb: () => {router.push("/account", "/account", {scroll: false})}}})
            set_loading(false)

        } catch ( err ) {
            //Couldnt reach server
        }
    }

    function setRef(el: HTMLInputElement | null) {
        passwordInputRef.current = el
    }



    return (
        <PageContent>
            
            <div className="login_container">
                <KingHeader title="Sign In" />
                
                <div className='input_container'>
                    <input ref={(el) => {emailInputRef.current = el}} type="text" placeholder="Email" className='primary big'/>
                    
                    <PasswordInput placeholder='Password' className='primary big' refCallb={(el) => {setRef(el)}}/>
                </div>

                <div className='button_wrapper'>
                    <Button clickWithEnter={true} onClick={login} className='primary default' btnLabel='Login' loading={loading} />
                </div>
                
                <div className='forward_wrapper'>
                    <ForwardContainer 
                        componentsArr=
                        {
                            [
                                <p key={"forgot_password"}>{"Did you forget your password? "}<Link href="/forgot_password" scroll={false}>Reset Password</Link></p>,
                                <p key={"signup"}>{"Don’t have an account? "}<Link href="/signup" scroll={false}>Create Account</Link></p>
                            ]
                        }
                    />
                </div>

            </div>

        </PageContent>
    );
}

