import { useRouter } from 'next/router';
import React, {useContext, useEffect, useState} from 'react';
import { Auth_context } from '../context/auth_context_provider';
import { Auth_context_type } from '../types';

export default function Protected_route({redirect, children}: any) {
    const [user_is_logged_in, set_user_is_logged_in] = useState<null | boolean>(null)
    const Auth: Auth_context_type = useContext(Auth_context)
    const router = useRouter()

    useEffect(() => {
        if(Auth.user.auth === true) {
            set_user_is_logged_in(true)
        } else if(Auth.user.auth === false) {
            set_user_is_logged_in(false)
        }
        
    }, [Auth.user])

    useEffect(() => {
        if(user_is_logged_in === false) {
            router.push("/login", "/login", {scroll: false})
        }
    }, [user_is_logged_in])

    return (
        
        <>
            {user_is_logged_in === true &&
                <>
                    {children}
                </>
            }
        </>
    );
}
