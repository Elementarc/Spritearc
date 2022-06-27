import React, {useState, useEffect} from "react";
import { ServerResponseEmail } from "../types";


function useGetUserSafeEmail() {
    const [safe_email, set_safe_email] = useState<null | string>(null)


    useEffect(() => {

        async function get_account_safe_email() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/get_email`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                })

                const response_obj = await response.json() as ServerResponseEmail
                if(!response_obj.success) return set_safe_email(null)
                set_safe_email(response_obj.email)

            } catch(err) {
                //COuldnt reach server
            }
        }
        get_account_safe_email()
        
    }, [])

    return safe_email
}

export default useGetUserSafeEmail