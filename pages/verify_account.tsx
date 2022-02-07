import React, {useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider';
import Head from 'next/head';


export default function Verify_account_page_handler() {
    const [verification_obj, set_verification_obj] = useState<null | {success: boolean, message: string}>(null)
    const router = useRouter()

    useEffect(() => {
        if(!router.query.token) return
        const controller = new AbortController()

        async function verify_account() {
            
            
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/verify_account`, {
                    method: "POST",
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({token: router.query.token})
                })

                if(response.status === 200) {
                    const response_obj = await response.json() as {success: boolean, message: string} // JSON PACK
                    set_verification_obj(response_obj)
                    
                } else {
                    set_verification_obj({success: false, message: "Something went wrong!"})
                    //router.push("/login", "/login", {scroll: false})
                }

            } catch(err) {
                //Couldnt reach server
                //router.push("/browse", "/browse", {scroll: false})
            }
        }
        verify_account()

        return(() => {
            controller.abort()
        })
        
    }, [router])

    return (
        <div style={{height: "100vh"}}>
            {verification_obj &&
                <Verify_account verification_obj={verification_obj}/>
            }
            
        </div>
    );
}

export function Verify_account({verification_obj}: {verification_obj: {success: boolean, message: string}}) {
    const App_notification: any = useContext(App_notification_context)
    const router = useRouter()

    //verifieng account
    useEffect(() => {
        if(!verification_obj) return
        console.log(verification_obj)
        if(verification_obj.success === true) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully verified!", message: "Thank you for verifying your account! We will now redirect you to our login page.", button_label: "Okay", callb: () => {router.push("/login", "/login", {scroll: false})}}})
        if(verification_obj.success === false) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Token has been expired!", message: "Your token has been expired. Please login to resend you a verification email.", button_label: "Okay", callb: () => {router.push("/login", "/login", {scroll: false})}}})
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [verification_obj])

    return (
        <>
            <Head>
                <title>{`Spritearc - Verify Account`}</title>
                <meta name="description" content={`Verify your account.`}/>

                <meta property="og:url" content="https://Spritearc.com/"/>
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`Spritearc - Verify Account`}/>
                <meta property="og:description" content={`Verify your account.`}/>
                <meta property="og:image" content={``}/>

                <meta name="twitter:card" content="summary_large_image"/>
                <meta property="twitter:domain" content="Spritearc.com"/>
                <meta property="twitter:url" content="https://Spritearc.com/"/>
                <meta name="twitter:title" content={`Spritearc - Verify Account`}/>
                <meta name="twitter:description" content={`Verify your account.`}/>
                <meta name="twitter:image:src" content={``}/>
            </Head>

            <div style={{height: "100vh"}} className="verification_page">

            </div>
    
        </>
    );  
}
