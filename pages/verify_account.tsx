import React, {useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Server_response } from '../types';
import { PopupProviderContext } from '../context/popupProvider';


export default function Verify_account_page_handler() {
    const [verification_obj, set_verification_obj] = useState<null | {success: boolean, message: string}>(null)
    const router = useRouter()

    useEffect(() => {
        if(typeof router.query.token !== "string") return
        const controller = new AbortController()

        async function verify_account() {
            
            
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/verify_account/${router?.query?.token}`, {
                    method: "POST",
                    signal: controller.signal,
                    headers: {
                        "Content-Type": "application/json"
                    },
                })

                const response_obj = await response.json() as Server_response

                if(!response_obj.success) set_verification_obj({success: response_obj.success, message: response_obj.message})
                set_verification_obj(response_obj)

            } catch(err) {
                //Couldnt reach server
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
    const popupContext = useContext(PopupProviderContext)
    const router = useRouter()

    //verifieng account
    useEffect(() => {
        if(!verification_obj) return
        if(verification_obj.success === true) {
            popupContext?.setPopup({
                success: true,
                title: "Successfully verified!",
                message: "Thank you for verifying your account! We will now redirect you to our login page.",
                buttonLabel: "Okay",
                cancelLabel: "Close window",
                buttonOnClick: () => {router.push("/login", "/login", {scroll: false}); popupContext.setPopup(null)}
            })
            return
        } 
        popupContext?.setPopup({
            success: true,
            title: "Token has been expired!",
            message: "Your token has been expired. Please login to resend you a verification email.",
            buttonLabel: "Okay",
            cancelLabel: "Close window",
            buttonOnClick: () => {router.push("/login", "/login", {scroll: false}); popupContext.setPopup(null)}
        })
            
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
                <meta property="og:image" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>

                <meta name="twitter:card" content="summary_large_image"/>
                <meta property="twitter:domain" content="Spritearc.com"/>
                <meta property="twitter:url" content="https://Spritearc.com/"/>
                <meta name="twitter:title" content={`Spritearc - Verify Account`}/>
                <meta name="twitter:description" content={`Verify your account.`}/>
                <meta name="twitter:image:src" content={`${process.env.NEXT_PUBLIC_ENV === "development" ? `` : `https://${process.env.NEXT_PUBLIC_APP_NAME}.com`}/images/spritearc_wallpaper.png`}/>
            </Head>

            <div style={{height: "100vh"}} className="verification_page">

            </div>
    
        </>
    );  
}
