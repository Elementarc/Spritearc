import React, {useContext, useState, useEffect, useRef} from 'react';
import Footer from '../components/footer';
import Link from 'next/link';
import MetaGenerator from '../components/MetaGenerator';
import PageContent from '../components/layout/pageContent';
import { PopupProviderContext } from '../context/popupProvider';
import Button from '../components/button';
import PasswordInput from '../components/passwordInput';
import apiCaller from '../lib/apiCaller';
import ForwardContainer from '../components/forwardContainer';
import KingHeader from '../components/kingHeader';
import { useRouting } from '../lib/custom_hooks';
import useStoreAccount from '../stores/account';


export default function PageRenderer() {
    
    return (
        <>
            <MetaGenerator 
                title='Spritearc - Login'
                description='Sign into your spritearc.com account to rate and publish pixel art packs.'
                url='https://Spritearc.com/login'
                imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
            />

            <LoginPage />

            <Footer/>
        </>
    );
}


export function LoginPage() {
    const [loading, set_loading] = useState(false)
    const popupContext = useContext(PopupProviderContext)
    const abortControllerRef = useRef(new AbortController())
    const passwordInputRef = useRef<null | HTMLInputElement>(null)
    const emailInputRef = useRef<null | HTMLInputElement>(null)
    const {push} = useRouting()
    const account = useStoreAccount()

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
        abortControllerRef.current = new AbortController()
        const passwordValue = passwordInputRef.current?.value
        if(!passwordValue) return
        const emailValue = emailInputRef.current?.value
        if(!emailValue) return
        
        const response = await account.login(emailValue, passwordValue, abortControllerRef.current.signal)
        
        push("/account")
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
                    <Button onClick={login} className='primary default' btnLabel='Login' loading={loading} />
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

