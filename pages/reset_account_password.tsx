import React, {useContext, useEffect, useState} from 'react';
import { useRouter } from 'next/router';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../context/app_notification_context_provider';
import { GetServerSideProps } from 'next';
import H1_with_deco from '../components/h1_with_deco';
import Footer from '../components/footer';
import { validate_password } from '../spritearc_lib/validate_lib';
import { App_notification_context_type } from '../types';
import Head from 'next/head';

export default function Reset_account_password() {
    const [password, set_password] = useState<string>("")
    const [password_repeat, set_password_repeat] = useState<string>("")
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    const router = useRouter()

    function set_error_messsage(element_id: string, message: string) {
        const get_password_message = document.getElementById(element_id) as HTMLParagraphElement

        get_password_message.innerText = message
    }

    function input_e_password(e: any) {
        const input_value = e.target.value as string
        
        set_password(input_value)
    }
    function input_e_password_repeat(e: any) {
        const input_value = e.target.value as string
        
        set_password_repeat(input_value)
    }


    useEffect(() => {
        const valid_password = validate_password(password)
        const button = document.getElementById("password_reset_button") as HTMLButtonElement

        if(!valid_password) {
            button.classList.add("disabled_button")
            return set_error_messsage("input_error_message_password", "Password needs to be atleast 8 characters long. One uppercase / lowercase and one number. Max. 32 characters")
        }
        set_error_messsage("input_error_message_password", "")
        button.classList.remove("disabled_button")
    }, [password])

    useEffect(() => {
        const button = document.getElementById("password_reset_button") as HTMLButtonElement

        const valid_password = validate_password(password)
        const valid_password_repeat = validate_password(password_repeat)

        if(!valid_password) {
            button.classList.add("disabled_button")
            return set_error_messsage("input_error_message_password", "Password needs to be atleast 8 characters long. One uppercase / lowercase and one number. Max. 32 characters")
        }
        if(!valid_password_repeat) {
            button.classList.add("disabled_button")
            return set_error_messsage("input_error_message_password_repeat", "Password needs to be atleast 8 characters long. One uppercase / lowercase and one number. Max. 32 characters")
        }

        if(password_repeat !== password) {
            button.classList.add("disabled_button")
            return set_error_messsage("input_error_message_password_repeat", "Passwords do not match")
        }
        set_error_messsage("input_error_message_password_repeat", "")
        set_error_messsage("input_error_message_password", "")

        
        button.classList.remove("disabled_button")
    }, [password, password_repeat])
    
    async function reset_password() {
        if(password !== password_repeat) return
        if(!validate_password(password)) return

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/reset_account_password`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({password: password, token: router.query.token})
            })

            if(response.status !== 200) return App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong!", message: "Something went wrong while trying to set your password. Please message an admin or try it again later", button_label: "Ok"}})
            App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully set password", message: "You have successfully resetted your password. You now can login into your with your new password.", button_label: "Login", callb: () => {router.push("/login", "/login", {scroll: false})}}})
        
        } catch (err) {
            //Couldnt reach server
        }
    }

    return (
        <>
            <Head>
				<title>{`Spritearc - Reset Account Password`}</title>
				<meta name="description" content={`Reset your account password.`}/>

				<meta property="og:url" content="https://Spritearc.com/"/>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={`Spritearc - Reset Account Password`}/>
				<meta property="og:description" content={`Reset your account password.`}/>
				<meta property="og:image" content={`/images/wallpaper.png`}/>

				<meta name="twitter:card" content="summary_large_image"/>
				<meta property="twitter:domain" content="Spritearc.com"/>
				<meta property="twitter:url" content="https://Spritearc.com/"/>
				<meta name="twitter:title" content={`Spritearc - Reset Account Password`}/>
				<meta name="twitter:description" content={`Reset your account password.`}/>
				<meta name="twitter:image" content={`/images/wallpaper.png`}/>
            </Head>
        
            <div className="reset_password_page">
                <div className='content'>
                    <div className='reset_password_container'>
                        <H1_with_deco title='Enter new password'></H1_with_deco>
                        <input onKeyUp={input_e_password}  type="password" placeholder={"Password"} id="input_password" />
                        <p className="input_error_message" id="input_error_message_password"></p>
                        <input onKeyUp={input_e_password_repeat} type="password" placeholder={"Password-repeat"} id="input_password_repeat" />
                        <p className="input_error_message" id="input_error_message_password_repeat"></p>
                        <button onClick={reset_password} id="password_reset_button">Reset Password</button>
                    </div>
                </div>
                <Footer/>
            </div>
        </>
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
        const token = context.query.token
        if(typeof token !== "string") return redirect
    
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/password_token_exists`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token: token})
            })
        
            console.log(response.status)
            if(response.status !== 200) return redirect
            
            return {
                props: {}
            }


        } catch(err) {
            return redirect
        }

    } catch( err ) {
        console.log(err)
        return redirect

    }

} 



