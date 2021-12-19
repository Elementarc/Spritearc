import React, {useReducer} from "react";
import { Public_user } from "../types";
export const Auth_context: any = React.createContext(null)

export const USER_DISPATCH_ACTIONS = {
    LOGIN: "SUCCESS",
    LOGOUT: "FAILED"
}

const user_init = {
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

function user_dispatch_reducer(user: any, action: {type: string, payload?: {auth: boolean, public_user: Public_user}}): any {
    const { type, payload } = action
    
    switch ( type ) {
        case USER_DISPATCH_ACTIONS.LOGIN : {
            if(!payload) return user_init
            if(!payload.public_user) user_init

            return {
                auth: payload.auth,
                ...payload.public_user
            }
        }

        case USER_DISPATCH_ACTIONS.LOGOUT : {
            return user_init
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


