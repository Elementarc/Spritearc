import React, {useReducer} from "react";
export const Auth_context: any = React.createContext(null)


function auth_reducer(state: any ,action: {type: string, payload: {username: string}}): any {
    const { type, payload } = action

    switch ( type ) {

        

    }
}
const init_auth = {
    authenticated: false,
    username: null
}
export default function Auth_context_provider({children}: any) {
    const [auth, auth_dispatch] = useReducer(auth_reducer, init_auth)
    const user = {
        auth,
        auth_dispatch
    }

    return (
        <Auth_context.Provider value={user}>
            {children}
        </Auth_context.Provider>
    );
}


