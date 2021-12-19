import React, {useReducer} from "react";
import { Public_user } from "../types";
import Router from "next/router"
export const Auth_context: any = React.createContext(null)

export const USER_DISPATCH_ACTIONS = {
    LOGIN: "SUCCESS",
    LOGOUT: "FAILED"
}

const user_init: any = {
    auth: null,
    username: null,
    description: null,
    created_at: null,
    profile_picture: null,
    profile_banner: null,
    followers: null,
    following: null,
    released_packs: null,
}

let init_public_user: any = {
    username: null,
    description: null,
    created_at: null,
    profile_picture: null,
    profile_banner: null,
    followers: null,
    following: null,
    released_packs: null,
}



function user_dispatch_reducer(user: any, action: {type: string, payload?: {public_user?: Public_user, callb?: () => void}}): any {
    const { type, payload } = action

    let init_public_user = {}

    if(!payload) return {auth: false, ...init_public_user}
    if(!payload.public_user) {
        init_public_user = {
            username: null,
            description: null,
            created_at: null,
            profile_picture: null,
            profile_banner: null,
            followers: null,
            following: null,
            released_packs: null,
        }
    } else {
        init_public_user = payload.public_user
    }

    switch ( type ) {
        case USER_DISPATCH_ACTIONS.LOGIN : {
            //When callback call function
            if(payload.callb) {
                payload.callb()
            }
            return {
                auth: true,
                ...init_public_user
            }
            
        }

        case USER_DISPATCH_ACTIONS.LOGOUT : {
            if(payload.callb) {
                payload.callb()
            }
            return {
                auth: false,
                ...init_public_user
            }
        }

        default : {
            return {
                auth: false,
                ...init_public_user
            }
        }
    }
}

export default function Auth_context_provider({children}: any) {
    const [user, dispatch_user] = useReducer(user_dispatch_reducer, user_init)
    
    const Auth = {
        user,
        dispatch_user
    }

    return (
        <Auth_context.Provider value={Auth}>
            {children}
        </Auth_context.Provider>
    );
}


