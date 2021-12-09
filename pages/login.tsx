import React, {useContext} from 'react';
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Link from 'next/link';
import { GetServerSideProps } from 'next'
import { Auth_context } from '../context/auth_context_provider';
import { useRouter } from 'next/router';
import { USER_DISPATCH_ACTIONS } from '../context/auth_context_provider';
export default function Login_page(props: any) {
    const Auth: any = useContext(Auth_context)
    const router = useRouter()
    async function login() {
        const email_input = document.getElementById("email_input") as HTMLInputElement
        const password_input = document.getElementById("password_input") as HTMLInputElement

        try {
            const response = await fetch("/api/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email_input.value,
                    password: password_input.value
                })
            })

            if(response.status === 200) {
                const body = await response.json()
                router.push("/", "/", {scroll: false})
                Auth.dispatch_user({type: USER_DISPATCH_ACTIONS.LOGIN, payload: {auth: true, username: body.username, description: body.description, created_at: body.created_at}})
                
                console.log("Successfully logged in")
                
            } else {
                console.log(await response.text())
            }

        } catch ( err ) {
            console.log(err)
        }
    }

    return (
        <div className="login_page">

            <div className="content">

                <div className="login_container">
                    <H1_with_deco title="Sign In" />

                    
                    <input type="text" placeholder="Email" id="email_input" defaultValue="king@gmail.com"/>
                    <input type="password" placeholder="Password" id="password_input" defaultValue="Hurrensohn1"/>
                    <button onClick={login}>Login</button>

                    <div className="forward_container">

                        <span className="bottom_section_line" />
                        <div className="items">
                            <p>{"Did you forget your password? "}<Link href="/signup" scroll={false}>Reset Password</Link></p>
                            <p>{"Don’t have an account? "}<Link href="/signup" scroll={false}>Create Account</Link></p>
                        </div>
                        
                    </div>

                </div>

            </div>
            <Footer />
        </div>
    );
}


export const getServerSideProps: GetServerSideProps = async(context) => {
	const cookies = context.req.cookies
    console.log(cookies)
    if(cookies.user) return {
        redirect: {
            destination: "/",
            permanent: false,
        }
    }

    
	return{
		props: {
			
		}
	}
} 



