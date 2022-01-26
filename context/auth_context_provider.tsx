import React, {useReducer} from "react";
import Router from "next/router"
import { Frontend_public_user, Public_user } from "../types";
export const Auth_context: any = React.createContext(null)

export const USER_DISPATCH_ACTIONS = {
    LOGIN: "SUCCESS",
    LOGOUT: "FAILED"
}

const init_public_user: Frontend_public_user = {
    auth: null,
    username: "",
    description: "",
    created_at: new Date(),
    profile_picture: "",
    profile_banner: "",
    followers: [],
    following: [],
    released_packs: [],
    role: ""
}

function user_dispatch_reducer(user: Frontend_public_user, action: {type: string, payload: {auth: boolean, public_user?: Public_user, callb?: () => void} | null}): any {
    const { type, payload } = action

    
    switch ( type ) {

        //Login
        case USER_DISPATCH_ACTIONS.LOGIN : {
            if(!payload) break
            if(!payload.public_user) break
            if(payload.callb) payload.callb()

            user = {auth: true, ...payload.public_user}
            

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
    
    return (
        <Auth_context.Provider value={{user, dispatch}}>
            {children}
        </Auth_context.Provider>
    );
}


