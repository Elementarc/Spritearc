import { AnimatePresence, motion} from "framer-motion";
import React, { useState, useEffect, useContext, useRef, useCallback} from "react";
import Footer from "../components/footer";
import Link from "next/dist/client/link";
import { Signup_obj } from "../types";
import H1_with_deco from '../components/h1_with_deco';
import DoneIcon from "../public/icons/DoneIcon.svg"
import Loading from "../components/loading";
import router from "next/router";
import { Device_context } from "../context/device_context_provider";
import VisibilityIcon from "../public/icons/VisibilityIcon.svg"
import VisibilityOffIcon from "../public/icons/VisibilityOffIcon.svg"
import { validate_email, validate_password, validate_username } from "../spritearc_lib/validate_lib";
import { PopupProviderContext } from "../context/popupProvider";
import MetaGenerator from "../components/MetaGenerator";
import PageContent from "../components/layout/pageContent";
import KingHeader from "../components/kingHeader";
import Button from "../components/button";
import Steps from "../components/steps";
import PasswordInput from "../components/passwordInput";
import CheckBox from "../components/checkBox";
import apiCaller from "../lib/apiCaller";
import ForwardContainer from "../components/forwardContainer";

interface Isignup {
    addAvailableStep: (step: number) => void,
    removeAvailableStep: (step: number) => void,
    nextStep: () => void,
    setErrorMessage: (paragraphElement: React.MutableRefObject<HTMLParagraphElement | null>, inputElement: React.MutableRefObject<HTMLParagraphElement | null>, error: boolean, message?: string | undefined) => void
}
const signupContext = React.createContext<Isignup | null>(null)

export default function PageRenderer() {
  return (
    <>
        <MetaGenerator
            title='Spritearc - Signup'
            description='Create an account to publish your own pixel art game assets and sprites to build yourself a community on spritearc.com!' 
            url='https://Spritearc.com/signup'
            imageLinkSecure={`https://${process.env.NEXT_PUBLIC_APP_NAME}.com/images/spritearc_wallpaper.png`}
		/>

        <SignupPage/>

        <Footer/>
    </>
  );
}

function SignupPage() {
    const popupContext = useContext(PopupProviderContext)
    const [email, setEmail] = useState<string | null>(null)
    const [username, setUsername] = useState<null | string>(null)
    const [password, setPassword] = useState<null | string>(null)
    const [legal, setLegal] = useState(false)
    const [occasionalEmails, setOccasionalEmails] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [availableSteps, setAvailableSteps] = useState<number[]>([1])

    function addAvailableStep(step: number) {
        if(!availableSteps.includes(step)) setAvailableSteps([...availableSteps, step])
    }
    function removeAvailableStep(step: number) {
        const index = availableSteps.indexOf(step)
        if(availableSteps[index]) {
            availableSteps.splice(index, 1)
            setAvailableSteps([...availableSteps])
        }
    }
    function nextStep() {
        const nextStep = currentStep + 1
        if(!availableSteps?.includes(nextStep)) return

        setCurrentStep(nextStep)
    }
    function resetSignup() {
        setUsername(null)
        setEmail(null)
        setPassword(null)
        setLegal(false)
        setOccasionalEmails(false)
        setCurrentStep(1)
        setAvailableSteps([])
    }
    async function createAccount(signal: AbortSignal) {
        if(!username || !email || !password || !legal) return

        try {
            const response = await apiCaller.createAccount(username, email, password, legal, occasionalEmails, signal)
            if(!response) return
            resetSignup()
            if (response.success) {
                popupContext?.setPopup({
                    success: true,
                    title: "Verify Account!",
                    message: "You successfully have created an account! We've sent you a comfirmation email to activate your account.",
                    buttonLabel: "Okay",
                    buttonOnClick: () => {router.push("/login", "/login", {scroll: false}); ; popupContext.setPopup(null)}
                })
            } else {
                popupContext?.setPopup({
                    success: false,
                    title: "Something went wrogn!",
                    message: "Something went wrong while trying to create your account! Please try again later.",
                    buttonLabel: "Okay",
                })
            }
        } catch (error) {
            
        }
    }

    const setErrorMessage = useCallback((paragraphElement: React.MutableRefObject<HTMLParagraphElement | null>, inputElement: React.MutableRefObject<HTMLParagraphElement | null>, error: boolean, message?: string) => {
        
        if(error) {
            inputElement.current?.classList.add("error")
            if(paragraphElement.current) paragraphElement.current.innerText = message ?? ""
        } else {
            inputElement.current?.classList.remove("error")
            if(paragraphElement.current) paragraphElement.current.innerText = ""
        }
        
    }, [])

    //Adding smooth scroll to page.
    useEffect(() => {
        document.documentElement.style.scrollBehavior = "smooth"
        return () => {
            document.documentElement.style.scrollBehavior = "unset"
        };
    }, [])
    
    return (
        <signupContext.Provider value={{addAvailableStep, removeAvailableStep, nextStep, setErrorMessage}}>
            <PageContent>
                <div className="signup_steps_container">
                    <AnimatePresence exitBeforeEnter>

                        {currentStep === 1 &&
                            <StepOne key="stepOne" username={username} setUsername={setUsername}/>
                        }
                        
                        { currentStep === 2 &&
                            <StepTwo key="stepTwo" email={email} setEmail={setEmail} />
                        } 
                        
                        { currentStep === 3 &&
                            <StepThree key="stepThree" 
                                password={password}
                                setPassword={setPassword} 
                                legal={legal} 
                                setLegal={setLegal} 
                                occasionalEmails={occasionalEmails} 
                                setOccasionalEmails={setOccasionalEmails}
                                createAccount={createAccount}
                            />
                        }

                    </AnimatePresence>

                    <div className="steps_tracker_container">
                        <Steps steps={3} currentStep={currentStep} setCurrentStep={setCurrentStep} availableSteps={availableSteps}/>
                    </div>

                    <div className="forward_wrapper">
                        <ForwardContainer 
                            componentsArr=
                            {
                                [
                                    <p>{"Already a member? "}<Link href="/login" scroll={false}>Sign In</Link></p>,
                                ]
                            }
                        />
                    </div>
                </div>
            </PageContent>
        </signupContext.Provider>
    );
}

function StepOne(props: {username: string | null, setUsername: React.Dispatch<React.SetStateAction<string | null>>}) {
    const signup = useContext(signupContext)
    const [loading, setLoading] = useState(false)
    const usernameInputRef = useRef<null | HTMLInputElement>(null)
    const errorMessageRef = useRef<null | HTMLParagraphElement>(null)
    const abortControllerRef = useRef<null | AbortController>(null)
    const timerRef = useRef<NodeJS.Timer | null>(null)
    const username = props.username
    const setUsername = props.setUsername
    const addAvailableStep = signup?.addAvailableStep
    const removeAvailableStep = signup?.removeAvailableStep
    const nextStep = signup?.nextStep
    const setErrorMessage = signup?.setErrorMessage
    if(!addAvailableStep || !removeAvailableStep || !nextStep || !setErrorMessage) return null

    
    //Making api call to backend to check if username is taken or not
    const usernameAvailable = useCallback(async(username: string, signal: AbortSignal) => {
        //Validating username sends a call to backend to verifiy if username already exist
        try {
            const apiCaller = (await import("../lib/apiCaller")).default
            const response = await apiCaller.usernameAvailable(username, signal)
            
            if(response?.success) return true
            else return false
            
        } catch ( err ) {
            console.log(err)
            //Error
            return false
        }
                
    }, [])

    //Validates userinput and calls usernameAvailable. Also sets errorMessages
    const validateUserInput = useCallback(async() => {
        return new Promise((resolve) => {
        
            if(timerRef.current) clearTimeout(timerRef.current)
            
            timerRef.current = setTimeout(async() => {
                abortControllerRef.current = new AbortController()

                if(!usernameInputRef.current) {
                    setErrorMessage(errorMessageRef,usernameInputRef, true, "Could not find inputfield")
                    setUsername(null)
                    removeAvailableStep(2)
                    return resolve(false)
                } 

                const validUsername = validate_username(usernameInputRef.current.value)
                if (typeof validUsername === "string") {
                    setErrorMessage(errorMessageRef,usernameInputRef,true, validUsername)
                    setUsername(null)
                    removeAvailableStep(2)
                    return resolve(false)
                }

                setLoading(true)
                const available = await usernameAvailable(usernameInputRef.current.value, abortControllerRef.current.signal)
                setLoading(false)

                if(!available) {
                    setErrorMessage(errorMessageRef,usernameInputRef, true, "Username is already taken!")
                    setUsername(null)
                    removeAvailableStep(2)
                    return resolve(false)
                } 
                
                setUsername(usernameInputRef.current.value)
                addAvailableStep(2)
                setErrorMessage(errorMessageRef,usernameInputRef,false)
                return resolve(true)
            }, 250);
        })
    }, [usernameInputRef, abortControllerRef, timerRef, addAvailableStep, usernameAvailable, setLoading, setErrorMessage])
    
    async function triggerNextStep() {
        const success = await validateUserInput()
        if(!success) return

        if(nextStep) nextStep()
    }

    //Cleanup
    useEffect(() => {
      
        return() => {
            if(abortControllerRef.current) abortControllerRef.current.abort()
            if(timerRef.current) clearTimeout(timerRef.current)
        }
    }, [abortControllerRef, timerRef])
    //UX STUFF
    useEffect(() => {
        usernameInputRef.current?.focus()
    }, [usernameInputRef])

    
    return (
        <motion.div className="signup_step_container" initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .3, delay: 0.2}}} exit={{opacity: 0, y: 50, transition: {duration: 0.2,  type: "tween"}}}>
                        
            <KingHeader title="Please enter an username"/>
            
            <div className="input_container">
                <input onKeyUp={validateUserInput} ref={(el) => {usernameInputRef.current = el}} type="text" placeholder={"Username"} className="big" defaultValue={username ? username : ""}></input>
            </div>

            <p ref={(el) => {errorMessageRef.current = el}} className="error"></p>

            <div className="button_wrapper">
                <Button clickWithEnter={true} onClick={triggerNextStep} className={`${username ? "primary" : "disabled"} default`} btnLabel="Next Step" loading={loading}/>
            </div>
            
        </motion.div>
    );
}
function StepTwo(props: {email: string | null, setEmail: React.Dispatch<React.SetStateAction<string | null>>}) {
    const signup = useContext(signupContext)
    const [loading, setLoading] = useState(false)
    const emailInputRef = useRef<null | HTMLInputElement>(null)
    const errorMessageRef = useRef<null | HTMLParagraphElement>(null)
    const abortControllerRef = useRef<null | AbortController>(null)
    const timerRef = useRef<NodeJS.Timer | null>(null)
    const email = props.email
    const setEmail = props.setEmail
    const addAvailableStep = signup?.addAvailableStep
    const removeAvailableStep = signup?.removeAvailableStep
    const nextStep = signup?.nextStep
    const setErrorMessage = signup?.setErrorMessage
    if(!addAvailableStep || !removeAvailableStep || !nextStep || !setErrorMessage) return null

    //Making api call to backend to check if username is taken or not
    const emailAvailable = useCallback(async(email: string, signal: AbortSignal) => {
        //Validating username sends a call to backend to verifiy if username already exist
        try {
            const apiCaller = (await import("../lib/apiCaller")).default
            const response = await apiCaller.emailAvailable(email, signal)
            
            if(response?.success) return true
            else return false
            
        } catch ( err ) {
            console.log(err)
            //Error
            return false
        }
                
    }, [])
    //Validates userinput and calls usernameAvailable. Also sets errorMessages
    const validateUserInput = useCallback(async() => {
        return new Promise((resolve) => {
            if(timerRef.current) clearTimeout(timerRef.current)
            
            timerRef.current = setTimeout(async() => {
                abortControllerRef.current = new AbortController()

                if(!emailInputRef.current) {
                    setErrorMessage(errorMessageRef, emailInputRef,true, "Could not find inputfield")
                    setEmail(null)
                    removeAvailableStep(3)
                    return resolve(false)
                } 

                const validEmail = validate_email(emailInputRef.current.value)
                if (typeof validEmail === "string") {
                    setErrorMessage(errorMessageRef, emailInputRef,true, validEmail)
                    setEmail(null)
                    removeAvailableStep(3)
                    return resolve(false)
                }

                setLoading(true)
                const available = await emailAvailable(emailInputRef.current.value, abortControllerRef.current.signal)
                setLoading(false)

                if(!available) {
                    setErrorMessage(errorMessageRef, emailInputRef,true, "Email is already taken!")
                    setEmail(null)
                    removeAvailableStep(3)
                    return resolve(false)
                } 
                
                setEmail(emailInputRef.current.value)
                addAvailableStep(3)
                setErrorMessage(errorMessageRef, emailInputRef,false)
                return resolve(true)
            }, 250);
        })
    }, [emailInputRef, abortControllerRef, timerRef, addAvailableStep, emailAvailable, setLoading, setErrorMessage])
    async function triggerNextStep() {
        const success = await validateUserInput()
        if(!success) return

        if(nextStep) nextStep()
    }

    //Cleanup
    useEffect(() => {
      
        return() => {
            if(abortControllerRef.current) abortControllerRef.current.abort()
            if(timerRef.current) clearTimeout(timerRef.current)
        }
    }, [abortControllerRef, timerRef])
    //UX STUFF
    useEffect(() => {
        emailInputRef.current?.focus()
    }, [emailInputRef])
    
    return (
        <motion.div className="signup_step_container" initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .3, delay: 0.2}}} exit={{opacity: 0, y: 50, transition: {duration: 0.2,  type: "tween"}}}>
                        
            <KingHeader title="Please enter an email"/>
            
            <div className="input_container">
                <input onKeyUp={validateUserInput} ref={(el) => {emailInputRef.current = el}} type="text" placeholder={"Example@domain.com"} className="big" defaultValue={email ? email : ''}></input>
            </div>

            <p ref={(el) => {errorMessageRef.current = el}} className="error"></p>

            <div className="button_wrapper">
                <Button clickWithEnter={true} onClick={triggerNextStep} className={`${email ? "primary" : "disabled"} default`} btnLabel="Next Step" loading={loading}/>
            </div>
            
        </motion.div>
    );
}
function StepThree(props: {password: string | null, setPassword: React.Dispatch<React.SetStateAction<string | null>>, createAccount: (signal: AbortSignal) => Promise<void>, legal: boolean, setLegal: React.Dispatch<React.SetStateAction<boolean>>, occasionalEmails: boolean, setOccasionalEmails: React.Dispatch<React.SetStateAction<boolean>>}) {
    const signup = useContext(signupContext)
    const [loading, setLoading] = useState(false)
    const passwordInputRef = useRef<null | HTMLInputElement>(null)
    const passwordRepeatInputRef = useRef<null | HTMLInputElement>(null)
    const passwordErrorMessageRef = useRef<null | HTMLParagraphElement>(null)
    const passwordRepeatErrorMessageRef = useRef<null | HTMLParagraphElement>(null)
    const abortControllerRef = useRef<null | AbortController>(null)
    const timerRef = useRef<NodeJS.Timer | null>(null)
    const password = props.password
    const legal = props.legal
    const setLegal = props.setLegal
    const occasionalEmails = props.occasionalEmails
    const setOccasionalEmails = props.setOccasionalEmails
    const setPassword = props.setPassword
    const setErrorMessage = signup?.setErrorMessage
    const addAvailableStep = signup?.addAvailableStep
    const removeAvailableStep = signup?.removeAvailableStep
    const nextStep = signup?.nextStep
    const createAccount = props.createAccount
    if(!addAvailableStep || !removeAvailableStep || !nextStep || !setErrorMessage) return null

    //Validates userinput and calls usernameAvailable. Also sets errorMessages
    const validateUserInput = useCallback(async() => {
        return new Promise((resolve) => {
        
            if(timerRef.current) clearTimeout(timerRef.current)
            
            timerRef.current = setTimeout(async() => {
                abortControllerRef.current = new AbortController()

                if(!passwordInputRef.current || !passwordRepeatInputRef.current) {
                    setErrorMessage(passwordErrorMessageRef, passwordInputRef, true, "Could not find inputfield")
                    setErrorMessage(passwordRepeatErrorMessageRef, passwordRepeatInputRef, true, "Could not find inputfield")
                    setPassword(null)
                    removeAvailableStep(4)
                    return resolve(false)
                } 
                
                const validPassword = validate_password(passwordInputRef.current.value)
                if (typeof validPassword === "string") {
                    setErrorMessage(passwordErrorMessageRef, passwordInputRef, true, validPassword)
                    setPassword(null)
                    removeAvailableStep(4)
                    return resolve(false)
                }
                if(passwordRepeatInputRef.current.value !== passwordInputRef.current.value) {
                    setErrorMessage(passwordErrorMessageRef,passwordInputRef, false)
                    setErrorMessage(passwordRepeatErrorMessageRef,passwordRepeatInputRef,  true, "Passwords do not match")
                    setPassword(null)
                    removeAvailableStep(4)
                    return resolve(false)
                }

                setErrorMessage(passwordErrorMessageRef,passwordInputRef, false)
                setErrorMessage(passwordRepeatErrorMessageRef,passwordRepeatInputRef, false)

                setPassword(passwordInputRef.current.value)
                addAvailableStep(4)
                return resolve(true)
            }, 200);
        })
    }, [passwordInputRef, passwordRepeatInputRef, abortControllerRef, timerRef,legal, addAvailableStep, setLoading, setErrorMessage])

    

    function refPasswordInput(el: HTMLInputElement | null) {
        passwordInputRef.current = el
    }
    function refPasswordRepeatInput(el: HTMLInputElement | null) {
        passwordRepeatInputRef.current = el
    }
    
    async function callCreateAccount() {
        if(!abortControllerRef.current) return

        setLoading(true)
        await createAccount(abortControllerRef.current.signal)
        setLoading(false)
    }
   
    async function triggerNextStep() {
        const success = await validateUserInput()
        if(!success) return
        if(!legal) return

        if(callCreateAccount) callCreateAccount()
    }
    //Cleanup
    useEffect(() => {
        
        return() => {
            if(abortControllerRef.current) abortControllerRef.current.abort()
            if(timerRef.current) clearTimeout(timerRef.current)
        }
    }, [abortControllerRef, timerRef])
    //UX STUFF
    useEffect(() => {
        passwordInputRef.current?.focus()
    }, [passwordInputRef])

    return (
        <motion.div className="signup_step_container" initial={{opacity: 0, y: -50}} animate={{opacity: 1, y: 0, transition: {duration: .3, delay: 0.2}}} exit={{opacity: 0, y: 50, transition: {duration: 0.2,  type: "tween"}}}>
                        
            <KingHeader title="Please create a Password"/>
            
            <div className="input_container">
                <div>
                    <PasswordInput defaultValue={password ? password : ""} type="password" onKeyUp={validateUserInput} placeholder={"Password"} className="big" refCallb={refPasswordInput}/>
                    <p ref={(el) => {passwordErrorMessageRef.current = el}} className="error"></p>
                </div>
                
                <div>
                    <PasswordInput defaultValue={password ? password : ""} type="password" onKeyUp={validateUserInput} placeholder={"Password"} className="big" refCallb={refPasswordRepeatInput}/>
                    <p ref={(el) => {passwordRepeatErrorMessageRef.current = el}} className="error"></p>
                </div>
            </div>

            <div className="legal_container">
                
                <CheckBox 
                    textComponent={<p>I agree to the <Link href="/tos" scroll={false}>Terms of use</Link> and i have read the <Link href="/privacy" scroll={false}>Privacy policy</Link> and accept it.</p>}
                    checkBox={legal}
                    setCheckBox={async() => {setLegal(!legal); await validateUserInput()}}
                />

                <CheckBox 
                    textComponent={<p>I want to get occasional E-mails from {`${process.env.NEXT_PUBLIC_APP_NAME}.com`}</p>}
                    checkBox={occasionalEmails}
                    setCheckBox={setOccasionalEmails}
                />
                

            </div>

            <div className="button_wrapper">
                <Button clickWithEnter={true} onClick={triggerNextStep} className={`${(password && legal) ? "primary" : "disabled"} default`} btnLabel="Create Account" loading={loading}/>
            </div>
            
        </motion.div>
    );
}

