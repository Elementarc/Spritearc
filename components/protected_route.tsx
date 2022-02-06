import { useRouter } from 'next/router';
import React, {useContext, useEffect, useState} from 'react';
import { Auth_context, USER_DISPATCH_ACTIONS } from '../context/auth_context_provider';
import { Auth_context_type } from '../types';

export default function Protected_route({children}: any) {
    const Auth: Auth_context_type = useContext(Auth_context)
    const [is_auth, set_is_auth] = useState<null | boolean>(null)
    const router = useRouter()
    
    useEffect(() => {
        function check_auth() {
            const user_token = sessionStorage.getItem("user") ? sessionStorage.getItem("user") : ""
            if(!user_token) {
                Auth.dispatch({type: USER_DISPATCH_ACTIONS.LOGOUT, payload: {auth: false, callb: () => {router.push("/login", "/login", {scroll: false})}}})
                return
            }
            return set_is_auth(true)
        }
        check_auth()
    }, [Auth.dispatch])

    return (
        <>
            {is_auth === true &&
                <>
                    {children}
                </>
            }
        </>
    );
}
