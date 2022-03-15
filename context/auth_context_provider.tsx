import React, {useReducer, useEffect, useMemo} from "react";
import Router, { useRouter } from "next/router"
import { Frontend_public_user, Public_user } from "../types";
export const Auth_context: any = React.createContext(null)

export const USER_DISPATCH_ACTIONS = {
    LOGIN: "SUCCESS",
    LOGOUT: "FAILED"
}

const init_public_user: Frontend_public_user = {
    auth: null,
    public_user: {
        _id: "",
        username: "",
        socials: {
            instagram: "",
            twitter: "",
            artstation: "",
        },
        description: "",
        created_at: new Date(),
        profile_picture: "",
        profile_banner: "",
        followers_count: 0,
        following_count: 0,
        banned: false,
        role: "",
        paypal_donation_link: null,
    }

}

function user_dispatch_reducer(user: Frontend_public_user, action: {type: string, payload: {auth: boolean, public_user?: Public_user, token?: string, callb?: () => void} | null}): any {
    const { type, payload } = action

    
    switch ( type ) {

        //Login
        case USER_DISPATCH_ACTIONS.LOGIN : {
            if(!payload) break
            if(!payload.public_user) break
            if(payload.callb) payload.callb()

            user = {auth: true, public_user: {...payload.public_user}}

            break
        }

        //Logout
        case USER_DISPATCH_ACTIONS.LOGOUT : {
            if(!payload) break
            if(payload.callb) payload.callb()

            user = {...init_public_user, auth: false}

            break
        }

        default : {
            user = {...init_public_user}
            
            break
        }
    }

    return {...user}
}

export default function Auth_context_provider({children}: any) {
    const [user, dispatch] = useReducer(user_dispatch_reducer, init_public_user)
    
    useEffect(() => {
        
        async function is_auth() {
            try {
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/is_auth`, {
                    method: "POST",
                    headers: {
						"Content-Type": "application/json"
					},
                    credentials: "include",
                })

                const response_obj = await response.json() as any
                
                if(response_obj.public_user) {
                    
                    dispatch({type: USER_DISPATCH_ACTIONS.LOGIN, payload: {auth: true, public_user: {...response_obj.public_user}, token: response_obj.token}})
                } else {
                    dispatch({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {auth: false}})
                }

            } catch(err){
                //console.log(err)
            }

        }
        
        is_auth()
    }, [dispatch])

    useEffect(() => {
        //console.log(user)
    }, [user])
    return (
        <Auth_context.Provider value={{user, dispatch}}>
            {children}
        </Auth_context.Provider>
    );
}


