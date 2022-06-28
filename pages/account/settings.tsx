import React, {useState, useContext, useRef, useEffect} from 'react';
import { ServerResponse, Public_user, PublicUser, ServerResponseIsAuth,  } from '../../types';
import Footer from '../../components/footer';
import { format_date } from '../../lib/date_lib';
import { validate_email, validate_password, validate_paypal_donation_link } from '../../spritearc_lib/validate_lib';
import ProfileIcon from "../../public/icons/ProfileIcon.svg"
import KeyIcon from "../../public/icons/KeyIcon.svg"
import EmailIcon from "../../public/icons/EmailIcon.svg"
import GroupIcon from "../../public/icons/GroupIcon.svg"
import DonationIcon from "../../public/icons/DonationIcon.svg"
import Image from 'next/image';
import useGetUserSafeEmail from '../../hooks/useGetUserSafeEmail';
import { PopupProviderContext } from '../../context/popupProvider';
import MetaGenerator from '../../components/MetaGenerator';
import PageContent from '../../components/layout/pageContent';
import { useRouting } from '../../lib/custom_hooks';
import apiCaller from '../../lib/apiCaller';
import PasswordInput from '../../components/passwordInput';
import useStoreAccount from '../../stores/account';



export default function PageRenderer() {

    return (
        <>
            <MetaGenerator 
                title={`Spritearc - Account Settings`} 
                description={`Edit important account informations.`} 
                url={`https://Spritearc.com/account`} 
                imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
            />
            <AccountPage />
            <Footer/>
        </>
    );
}



export function AccountPage() {
    const [settings_state, set_settings_state] = useState("account")
    
    return (

        <PageContent>
            <>
                <div className='account_settings_navigation'>

                    <div className='account_navigation_items_container'>
                    
                        <AccountNavigationCard state="account" icon={ProfileIcon} current_state={settings_state} set_current_state={set_settings_state} />
                        <AccountNavigationCard state="email" icon={EmailIcon} current_state={settings_state} set_current_state={set_settings_state} />
                        <AccountNavigationCard state="password"icon={KeyIcon} current_state={settings_state} set_current_state={set_settings_state} />
                        <AccountNavigationCard state="socials" icon={GroupIcon} current_state={settings_state} set_current_state={set_settings_state} />
                        <AccountNavigationCard state="donation"icon={DonationIcon} current_state={settings_state} set_current_state={set_settings_state} />

                    </div>

                </div>
                

                <div className='account_content'>
                    {settings_state === "account" &&
                        <AccountInformations/>
                    }

                    {settings_state === "email" &&
                        <EmailSettings/>
                    }
                    
                    {settings_state === "password" &&
                        <PasswordSettings/>
                    }

                    {settings_state === "socials" &&
                        <SocialSettings />
                    }

                    {settings_state === "donation" &&
                        <DonationSettings/>
                    }
                </div>

                <div className='account_background_blob_container'>
                    <Image loading='lazy' unoptimized={true} src={"/blobs/blob_3.svg"} layout="fill"  alt="Big wave blob"></Image>
                </div>
            </>
        </PageContent>
    );
}

export function AccountNavigationCard(props: {state: string, icon: any, current_state: string, set_current_state: React.Dispatch<React.SetStateAction<string>>}) {
    const Icon = props.icon
    const state = props.state
    const current_state = props.current_state
    const set_current_state = props.set_current_state

    return(
        <div onClick={() => {set_current_state(state)}} className={`${state.toLowerCase() === current_state.toLowerCase() ? "account_navigation_item_active" : "account_navigation_item"}`}>
            <Icon/>
        </div>
    )
}

function AccountInformations() {
    const popupContext = useContext(PopupProviderContext)
    const account = useStoreAccount()
    const abortControllerRef = useRef<null | AbortController>(null)
    const {push} = useRouting()
    const publicUser = account.userData

    const safe_email = useGetUserSafeEmail()
    const passwordInputRef = useRef<null | HTMLInputElement>(null)
    
    const deleteAccountWarning = () => {
        popupContext?.setPopup({
            success: false,
            title: "Delete Account?",
            message: "Keep in mind that you will not be able to undo this action and all your data and progress will be lost. There is no going back!",
            buttonLabel: "Delete Account",
            cancelLabel: "No, changed my mind",
            buttonOnClick: deleteAccountPopup
            
        })
    }
    
    const deleteAccountPopup = () => {
        popupContext?.setPopup({
            success: false,
            title: "Enter Password",
            message: "Please confirm your choice by entering your account password.",
            component: (
                <InputContainer innerRef={passwordInputRef}/>
            ),
            buttonLabel: "Delete Account",
            cancelLabel: "Close window",
            buttonOnClick: deleteAccount
        })
    }
    
    const deleteAccount = async() => {
        try {
            abortControllerRef.current = new AbortController()
            if(!passwordInputRef.current) return

            const response = await account.deleteAccount(passwordInputRef.current.value, abortControllerRef.current.signal)

            if(!response?.success) {
                popupContext?.setPopup({
                    success: false,
                    title: "Something went wrong!",
                    message: "Something went wrong while trying to delete your account. Please contact an admin.",
                    buttonLabel: "Okay",
                    cancelLabel: "Close window",
                })
                return

            }

            popupContext?.setPopup({
                success: true,
                title: "Successfully deleted your account!",
                message: "We have successfully deleted your account. We are sorry that we could'nt reach your expectations! We will work on to improve our service. Thank you for trying!",
                buttonLabel: "Okay",
                cancelLabel: "Close window",
                buttonOnClick: () => {
                    push("/")
                    popupContext?.setPopup(null)
                }
            })

        } catch(err) {
            //COuldnt reach server
        }
    }

    return(
        <>
            <div className='account_informations_container'>
                <div className='header_content'>
                    <h1>Account Informations</h1>
                    <p>Here you can find general informations about your account!</p>
                </div>

                <div className='informations_grid_container'>

                    <div className='grid_item'>
                        <p className='grid_property'>Username:</p>
                        <p className='grid_value'>{publicUser?.username}</p>
                    </div>

                    <div className='grid_item'>
                        <p className='grid_property'>Email:</p>
                        <p className='grid_value'>{safe_email ? safe_email : "undefined"}</p>
                    </div>

                    <div className='grid_item'>
                        <p className='grid_property'>Role:</p>
                        <p className='grid_value'>{publicUser?.role}</p>
                    </div>

                    <div className='grid_item'>
                        <p className='grid_property'>User since:</p>
                        <p className='grid_value'>{publicUser?.created_at ? format_date(publicUser.created_at) : "Error"}</p>
                    </div>
                </div>

                <p className='delete_account_text' onClick={deleteAccountWarning}>DELETE YOUR ACCOUNT</p>
            </div>
        </>
    )
}

function EmailSettings() {
    const refs = useRef<any>([])
    const popupContext = useContext(PopupProviderContext)
    function disable_button(state: boolean) {
        if(state === true) {
            refs.current["update_email_button"].classList.add("disabled_button")
            refs.current["update_email_button"].classList.remove("active_button")
        } else {
            refs.current["update_email_button"].classList.add("active_button")
            refs.current["update_email_button"].classList.remove("disabled_button")
        }
    }

    function on_key_up_email_validation(e: any) {

        const valid_email = validate_email(refs.current["new_email"].value)
        if(typeof valid_email === "string") {
            disable_button(true)
        } else {
            disable_button(false)
        }

    }

    
    async function submit_new_email() {
        const valid_new_email = validate_email(refs.current["new_email"].value)
        if(typeof valid_new_email === "string") {
            disable_button(true)
        } else {
            disable_button(false)
        }

        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_email`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({new_email: refs.current["new_email"].value, password: refs.current["current_password"].value})
            })
            
            const response_obj = await response.json() as ServerResponse
            
            if(response.status !== 200) {
                popupContext?.setPopup({
                    success: false,
                    title: "Something went wrong!",
                    message: response_obj.message,
                    buttonLabel: "Okay",
                    cancelLabel: "Close window",
                    buttonOnClick: () => {refs.current["new_email"].value = ""; refs.current["current_password"].value = "";disable_button(true)}
                })
                return
            } 
            
            if(!response_obj.success) {
                popupContext?.setPopup({
                    success: false,
                    title: "Email is already in use!",
                    message: "Please choose an email that is not in use! Make sure that you are the owner of that email address!",
                    buttonLabel: "Okay",
                    cancelLabel: "Close window",
                    buttonOnClick: () => {refs.current["new_email"].value = ""; refs.current["current_password"].value = "";disable_button(true)}

                })
                return
            } 

            popupContext?.setPopup({
                success: true,
                title: "Successfully updated your email!",
                message: "You have successfully updated your email. You can now login with your new email address.",
                buttonLabel: "Okay",
                cancelLabel: "Close window",
                buttonOnClick: () => {refs.current["new_email"].value = ""; refs.current["current_password"].value = "";disable_button(true)}
            })

        } catch(err) {
            //Couldnt reach server
        }
    }


    return(
        <div className='email_settings_container'>
            <div className='header_content'>
                <h1>Update Your Email</h1>
                <p>Here you can update your current email address to a new one!</p>
            </div>

            <input ref={(el) => {refs.current["current_password"] = el}} type="password" placeholder='Current Password'/>
            <input ref={(el) => {refs.current["new_email"] = el}} onKeyUp={on_key_up_email_validation} onChange={on_key_up_email_validation} id="new_email_input" type="text" placeholder='New Email'/>
            <button ref={(el) => refs.current["update_email_button"] = el} id="update_email_button" onClick={submit_new_email} className='disabled_button'>Update Email</button>
        </div>
    )
}
function PasswordSettings() {
    const refs = useRef<any>([])
    const popupContext = useContext(PopupProviderContext)

    function disable_button(state: boolean) {
        if(state === true) {
            refs.current["update_password_button"].classList.add("disabled_button")
            refs.current["update_password_button"].classList.remove("active_button")
        } else {
            refs.current["update_password_button"].classList.add("active_button")
            refs.current["update_password_button"].classList.remove("disabled_button")
        }
    }
    function reset_inputs() {
        refs.current["current_password"].value = ""
        refs.current["new_password"].value = ""
        refs.current["new_password_repeat"].value = ""
    }
    function validate_both_passwords(): boolean | string {
        disable_button(true)
        const current_password = refs.current["current_password"].value
        const new_password = refs.current["new_password"].value
        const new_password_repeat = refs.current["new_password_repeat"].value

        if(new_password !== new_password_repeat) return "Passwords do not match!"

        const valid_new_password = validate_password(new_password)
        if(typeof valid_new_password === "string") {
            return valid_new_password
            
        } else {
            disable_button(false)
            return true
        }
    }

    async function submit_new_password() {
        const valid_passwords = validate_both_passwords()

        if(typeof valid_passwords === "string") {
            disable_button(true)
        } else {
            disable_button(false)
        }

        try {
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/update_password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({current_password: refs.current["current_password"].value, new_password: refs.current["new_password"].value})
            })
            
            const response_obj = await response.json() as {success: boolean, message: string}

            if(response_obj.success) {
                popupContext?.setPopup({
                    success: true,
                    title: "Successfully updated your Password!",
                    message: "You have successfully updated your Password.",
                    buttonLabel: "Okay",
                    cancelLabel: "Close window",
                    buttonOnClick: () => {reset_inputs(); disable_button(true); popupContext.setPopup(null)}
                })
            } else {
                popupContext?.setPopup({
                    success: true,
                    title: "Something went wrong!",
                    message: `We could'nt update what you wanted because: ${response_obj.message}`,
                    buttonLabel: "Okay",
                    cancelLabel: "Close window",
                    buttonOnClick: () => {reset_inputs(); disable_button(true); popupContext.setPopup(null)}
                })
            }

        } catch(err) {
            //COuldnt reach server
        }
    }

    return(
        <div className='password_settings_container'>
            <div className='header_content'>
                <h1>Update Your Password</h1>
                <p>Here you can set a new password!</p>
            </div>

            <input ref={(el) => {refs.current["current_password"] = el}} type="password" placeholder='Current Password'/>
            <input ref={(el) => {refs.current["new_password"] = el}} onChange={validate_both_passwords} type="password" placeholder='New Password'/>
            <input ref={(el) => {refs.current["new_password_repeat"] = el}} onChange={validate_both_passwords} type="password" placeholder='New Password Repeat'/>
            <button ref={(el) => refs.current["update_password_button"] = el} onClick={submit_new_password} className='disabled_button'>Update Password</button>
        </div>
    )
}
function SocialSettings() {
    const account = useStoreAccount()
    const controllerRef = useRef<null | AbortController>(null)
    const instaInputRef = useRef<null | HTMLInputElement>(null)
    const twitterInputRef = useRef<null | HTMLInputElement>(null)
    const artstationInputRef = useRef<null | HTMLInputElement>(null)
    if(!account.userData) return null

    const publicUser = account.userData

    const updateSocials = async() => {

        try {
            controllerRef.current = new AbortController()

            const socials = {
                instagram: instaInputRef?.current?.value,
                twitter: twitterInputRef?.current?.value,
                artstation: artstationInputRef?.current?.value
            }

            const response = await account.setSocials(socials, controllerRef.current.signal)
            
        } catch(err) {
            //COuldnt reach server
        } 
    }

    return(
        <div className='social_settings_container'>
            <div className='header_content'>
                <h1>Update Your Socials</h1>
                <p>Here you can link your social medias!</p>
            </div>

            <div className='socials_content'>
                <div className='social_flex'>
                    <p>www.Instagram.com/</p>
                    <input ref={instaInputRef} type="text" defaultValue={publicUser?.socials?.instagram?.length > 0 ? publicUser?.socials?.instagram : ""} placeholder='Account'/>
                </div>

                <div className='social_flex'>
                    <p>www.Twitter.com/</p>
                    <input ref={twitterInputRef} type="text" defaultValue={publicUser?.socials?.twitter.length > 0 ? publicUser?.socials?.twitter : ""} placeholder='Account'/>
                </div>

                <div className='social_flex'>
                    <p>www.Artstation.com/</p>
                    <input ref={artstationInputRef} type="text" defaultValue={publicUser?.socials?.artstation.length > 0 ? publicUser?.socials?.artstation : ""} placeholder='Account'/>
                </div>
                
                <button onClick={updateSocials}>Save Changes</button>
            </div>
            
        </div>
    )
}
function DonationSettings() {
    const donationLinkInputRef = useRef<null | HTMLInputElement>(null)
    const passwordInputRef = useRef<null | HTMLInputElement>(null)
    const controllerRef = useRef<null | AbortController>(null)
    const account = useStoreAccount()
    const public_user = account.userData

    const setDonationLink = async() => {
        if(!donationLinkInputRef.current) return
        if(!passwordInputRef.current) return
        controllerRef.current = new AbortController()
        try {
            
            const response = await account.setDonationLink(donationLinkInputRef.current.value, passwordInputRef.current.value, controllerRef.current.signal)

        } catch(err) {
            //Couldnt reach server
        }
    }

    return(
        <div className='donation_settings_container'>
            <div className='header_content'>
                <h1>Update Your Donation Link</h1>
                <p>Here you can add your <a href='https://www.paypal.com/donate/buttons' rel="noreferrer" target={"_blank"}>Paypal donation</a> link to your account. Make sure to keep it up to date, so people can tip you!</p>
            </div>

            <input ref={passwordInputRef} type="password" placeholder='Current Password'/>
            <input ref={donationLinkInputRef}  type="text" defaultValue={public_user?.paypal_donation_link ? `${public_user.paypal_donation_link}` : ""} placeholder='Donation Link'/>
            <button onClick={setDonationLink} className='disabled_button'>Save Donation Link</button>
        </div>
    )
}


function InputContainer({innerRef}: {innerRef: React.MutableRefObject<HTMLInputElement | null>}) {

    useEffect(() => {
        if(!innerRef?.current) return
        innerRef.current.focus()
    }, [innerRef])

    return (
        <PasswordInput refCallb={(el) => innerRef.current = el} className="primary default"/>
    );
}