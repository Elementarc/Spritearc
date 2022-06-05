import React, {useState, useEffect} from "react";
import { Server_response_credits } from "../types";


function useGetUserCredits(): number | null {
    const [credits, set_credits] = useState<null | string | number>(null)

    useEffect(() => {
        const controller = new AbortController()

        async function get_credits() {

            try {
               
                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/get_credits`, {
                    method: "POST",
                    headers: {
						"Content-Type": "application/json",
					},
                    credentials: "include",
                    signal: controller.signal,
                })

                const response_obj = await response.json() as Server_response_credits
                const credits = response_obj?.credits
                    
                set_credits(`${credits}`)
            } catch(err) {
                //Could not reach server
            }
            
        }
        get_credits()

        return(() => {
            controller.abort()
        })
    }, [set_credits])

    return credits ? parseInt(`${credits}`) :  null
}

export default useGetUserCredits