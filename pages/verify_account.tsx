import React, {useContext, useEffect} from 'react';
import { useRouter } from 'next/router';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider';


export default function Verify_account() {
    const App_notification: any = useContext(App_notification_context)
    const router = useRouter()

    //verifieng account
    useEffect(() => {

        async function verify_account() {
            const token = router.query.token
            if(typeof token !== "string") return router.push("/login", "/login", {scroll: false})
            if(!token) return router.push("/login", "/login", {scroll: false})
            const response = await fetch("/signup/verify_account", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token: token})
            })

            if(response.status === 200) {
                const status = await response.json() as {success: boolean, message: string}

                if(status.success === true) return App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully verified!", message: "Thank you for verifying your account! We will now redirect you to our login page.", button_label: "Okay", callb: () => {router.push("/login", "/login", {scroll: false})}}})
                App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Token has been expired!", message: "Your token has been expired. Please login to resend you a verification email.", button_label: "Okay", callb: () => {router.push("/login", "/login", {scroll: false})}}})

            } else {
                App_notification.dispatch_app_notification({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong while trying to verify your account!", message: "Please relog and try again!", button_label: "Okay", callb: () => {router.push("/login", "/login", {scroll: false})}}})
            }
        }
        verify_account()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query])

    return (
        <div style={{height: "100vh"}} className="verification_page">

        </div>
    );
}




