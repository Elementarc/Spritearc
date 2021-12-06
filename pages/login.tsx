import React, {useContext} from 'react';
import Footer from '../components/footer';
import H1_with_deco from '../components/h1_with_deco';
import Link from 'next/link';
import { GetServerSideProps } from 'next'
import { Auth_context } from '../context/auth_context_provider';

export default function Login_page() {

    async function login() {
        const email_input = document.getElementById("email_input") as HTMLInputElement
        const password_input = document.getElementById("password_input") as HTMLInputElement


        try {
            const response = await fetch("/api/login", {
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
                
                if(body.authenticated === true) {
                    
                    console.log("successfully logged in!")

                } else {

                    console.log("wrong credentials")

                }
                
            } else {
                console.log("something went wrong")
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

                    
                    <input type="text" placeholder="Email" id="email_input"/>
                    <input type="password" placeholder="Password" id="password_input"/>
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
    const cookie = context.req.headers.cookie
    console.log(cookie)

    if(cookie) return {redirect: {destination: "/", permanent: false}}
    
    return {
        props: {}
    }
}