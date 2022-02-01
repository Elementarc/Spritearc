import React, {useContext, useEffect} from 'react';
import { useRouter } from 'next/router';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider';
import { GetServerSideProps } from 'next';

export default function Verify_account({status, message}: {status: boolean, message: string}) {
    const App_notification: any = useContext(App_notification_context)
    const router = useRouter()

    //verifieng account
    useEffect(() => {
            
        if(status === true) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully verified!", message: "Thank you for verifying your account! We will now redirect you to our login page.", button_label: "Okay", callb: () => {router.push("/login", "/login", {scroll: false})}}})
        App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Token has been expired!", message: "Your token has been expired. Please login to resend you a verification email.", button_label: "Okay", callb: () => {router.push("/login", "/login", {scroll: false})}}})
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, message])

    return (
        <div style={{height: "100vh"}} className="verification_page">

        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async(context) => {
    const redirect = {
        redirect: {
            destination: `/browse`,
            permanent: false,
        }
    }
    try {
        
        if(typeof context.query.token === "string") {
            
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/signup/verify_account`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include",
                    body: JSON.stringify({token: context.query.token})
                })
            
            
                console.log(response.status)
                if(response.status === 200) {
                    const response_obj = await response.json() as {success: boolean, message: string} // JSON PACK
                    
                    return {
                        props: {
                            status: response_obj.success,
                            message: response_obj.message
                        }
                    }
                } else {
                    return redirect
                }
            } catch(err) {
                return redirect
            }
            
            
            
        } else {
            return redirect

        }

    } catch( err ) {
        console.log(err)
        return redirect

    }

} 




