import React, {useReducer} from "react";
export const Auth_context: any = React.createContext(null)

export const USER_DISPATCH_ACTIONS = {
    LOGIN: "SUCCESS",
    LOGOUT: "FAILED"
}



function user_dispatch_reducer(user: any, action: {type: string, payload?: {auth: boolean, username: string, description: string, created_at: string, profile_picture: string, profile_banner: string}}): any {
    const { type, payload } = action
    
    switch ( type ) {
        case USER_DISPATCH_ACTIONS.LOGIN : {

            if(!payload) return {
                auth: false,
                username: null,
                picture: null,
                description: null,
                created_at: null,
            }

            return {
                auth: payload.auth,
                username: payload.username,
                profile_picture: payload.profile_picture,
                profile_banner: payload.profile_banner,
                description: payload.description,
                created_at: payload.created_at,
            }
        }

        case USER_DISPATCH_ACTIONS.LOGOUT : {
            return {
                auth: false,
                username: null,
                picture: null,
                description: null,
                created_at: null,
            }
        }
    }
}


const user_init = {
    username: null, 
    description: null, 
    created_at: null,
    profile_picture: null,
    profile_banner: null,
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


