import React, {useReducer, useState, useEffect, useCallback} from "react";
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
}

function user_dispatch_reducer(user: null | {username: string}, action: {type: string, payload?: {auth: boolean, username: string, description: string, created_at: string, picture: string}}): any {
    const { type, payload } = action
    
    switch ( type ) {
        case USER_DISPATCH_ACTIONS.LOGIN : {
            if(!payload) return user_init
            return {
                auth: payload.auth,
                username: payload.username,
                picture: payload.picture,
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


