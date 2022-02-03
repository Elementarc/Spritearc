import React, {useEffect, useState, useContext} from 'react';
import { GetServerSideProps } from 'next';
import jwt from "jsonwebtoken"
import { Public_user, App_notification_context_type, Auth_context_type } from '../../types';
import Footer from '../../components/footer';
import { format_date } from '../../lib/date_lib';
import { App_notification_context, NOTIFICATION_ACTIONS } from '../../context/app_notification_context_provider';
import Fixed_app_content_overlay from '../../components/fixed_app_content_overlay';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Auth_context, USER_DISPATCH_ACTIONS } from '../../context/auth_context_provider';


export default function Account_settings(props: {public_user: Public_user}) {
    const [safe_email, set_safe_email] = useState<null | string>(null)
    const App_notification: App_notification_context_type = useContext(App_notification_context)
    const Auth: Auth_context_type = useContext(Auth_context)
    const [account_delete_warning, set_account_delete_warning] = useState(false)
    const [delete_account, set_delete_account] = useState(false)
    const [settings_state, set_settings_state] = useState("account")
    const router = useRouter()
    const user = props.public_user

    useEffect(() => {

        async function get_account_safe_email() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/get_email`,{
                    method: "POST",
                    credentials: "include",
                    body: JSON.stringify({user: user.username})
                })

                if(response.status === 200) {
                    const safe_email = await response.json() as {email: string}
                    set_safe_email(safe_email.email)
                }
            } catch(err) {
                //COuldnt reach server
            }
        }
        get_account_safe_email()
        
    }, [])

    async function delete_account_call() {
        try {
            const password_input = document.getElementById("account_password_input") as HTMLInputElement
            if(!password_input) return

            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/delete_account`, {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({password: password_input.value})
            })


            if(response.status === 200) {
                const response_obj = await response.json() as {success: boolean, message: string}

                if(response_obj.success) {
                    App_notification.dispatch({type: NOTIFICATION_ACTIONS.SUCCESS, payload: {title: "Successfully deleted your account!", message: "We have successfully deleted your account. We are sorry that we could'nt reach your expectations! We will work on to improve our service. Thank you for trying!", button_label: "Okay", callb: () => {router.push("/", "/", {scroll: false}); Auth.dispatch({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {auth: false}})}}})
                } else {
                    App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Wrong password!", message: "We couldn't delete your account because you have entered the wrong password!", button_label: "Okay"}})
                }
            } else {
                App_notification.dispatch({type: NOTIFICATION_ACTIONS.ERROR, payload: {title: "Something went wrong", message: "For some reason we couldn't delete your account! We are sorry that you have to experience this. Please contact an admin or try again later.", button_label: "Okay"}})
            }
        } catch(err) {
            //COuldnt reach server
        }
    }
    return (
        <div className='account_settings_page'>

            
                <Fixed_app_content_overlay>
                    <div className='fixed_account_settings_container'>
                        <AnimatePresence exitBeforeEnter>
                            { account_delete_warning &&

                                <motion.div key="delete_account_warning" initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, transition: {duration: .2, type: "tween"}}} className='delete_account_confirmation_container'>
                                    <motion.div initial={{opacity: 0, scale: .8}} animate={{opacity: 1, scale: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, scale: .8, transition: {duration: .2, type: "tween"}}}  className='confirmation_content'>
                                        <h1>Delete Account</h1>
                                        <p>Remember, all your packs will be deleted and they wont be recoverable anymore. There is no going back afterwards!</p>
                                        <button onClick={() => {set_account_delete_warning(false); set_delete_account(true)}}>Yes, delete account!</button>
                                        <h4 onClick={() => {set_account_delete_warning(false)}}>No, dont delete account</h4>
                                    </motion.div>

                                    <div onClick={() => {set_account_delete_warning(false)}} className='delete_account_confirmation_background' />
                                </motion.div>
                            }

                            { delete_account &&

                                <motion.div key="delete_account" initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, transition: {duration: .2, type: "tween"}}} className='delete_account_container'>
                                    <motion.div initial={{opacity: 0, scale: .8}} animate={{opacity: 1, scale: 1, transition: {duration: .2, type: "tween"}}} exit={{opacity: 0, scale: .8, transition: {duration: .2, type: "tween"}}}  className='delete_account_content'>
                                        <h1>Please enter your password</h1>
                                        <p>To delete your account please enter your account password as your final step.</p>
                                        <input id="account_password_input" type="password" placeholder='Password'/>
                                        <button onClick={delete_account_call}>DELETE ACCOUNT</button>
                                        <h4 onClick={() => {set_delete_account(false)}}>I changed my mind.</h4>
                                    </motion.div>

                                    <div onClick={() => {set_delete_account(false)}} className='delete_account_background' />
                                </motion.div>
                            }

                        </AnimatePresence>
                    </div>
                </Fixed_app_content_overlay>
            
            

            <div className='content'>
                <div className='account_settings_header'>
                    <h1>Account Settings</h1>
                    <p>Change important account informations</p>
                </div>

                <div className='settings_container'>
                    <div className='settings_navigator'>
                        <Settings_navigation_item name='Account' current_state={settings_state} set_current_state={set_settings_state}/>
                        <Settings_navigation_item name='Email' current_state={settings_state} set_current_state={set_settings_state}/>
                        <Settings_navigation_item name='Password' current_state={settings_state} set_current_state={set_settings_state}/>

                        <div className='deco_container'>
                            <span></span>
                        </div>
                    
                    </div>

                    <div className='settings_content'>
                        { settings_state === "account" && 
                            <div className='account_content'>
                                <h1>General info</h1>
                                
                                <div className='general_info_container'>
                                    <div className='grid_item'>
                                        <div className='item_1'>Username:</div>
                                        <div className='item_2'>{user.username}</div>
                                    </div>

                                    <div className='grid_item'>
                                        <div className='item_1'>Email:</div>
                                        <div className='item_2'>{`${safe_email}`}</div>
                                    </div>

                                    <div className='grid_item'>
                                        <div className='item_1'>User since:</div>
                                        <div className='item_2'>{format_date(user.created_at)}</div>
                                    </div>
                                </div>

                                <div className='delete_account_container'>
                                        <p onClick={() => {set_account_delete_warning(true)}} className='delete_account'>DELETE ACCOUNT</p>
                                    </div>
                            </div>
                        }

                        { settings_state === "email" && 
                            <div className='email_content'>
                                
                            </div>
                        }

                        { settings_state === "account" && 
                            <div className='password_content'>
                                
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Footer/>
            
        </div>
    );
}

export function Settings_navigation_item({name, current_state, set_current_state}: {name: string, current_state: string, set_current_state: React.Dispatch<React.SetStateAction<string>>}) {

    return (
        <div onClick={() => {set_current_state(name.toLowerCase())}} className='settings_navigation_item'>
            <p style={current_state.toLowerCase() === name.toLowerCase() ? {color: "white"} : {}}>{name}</p>
        </div>
    );
}


export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const redirect = {redirect: {
        permanent: false,
        destination: "/login"
    }}

    try {
        const user = jwt.verify(context.req.cookies.user, process.env.JWT_PRIVATE_KEY as string) as Public_user

        if(user) {
            

            return {
                props: {
                    public_user: user,
                }
            }
            
            
        } else {
            return redirect
        }

    } catch (err) {
        return redirect
    }
}