import React, {useState, useEffect, useCallback, useRef} from "react";
import apiCaller from "../lib/apiCaller";
import { PublicUser } from "../types";


function useGetPublicUser(username: string): PublicUser | null {
    const [publicUser, setPublicUser] = useState<null | PublicUser>(null)
    const abortControllerRef = useRef<null | AbortController>(null)
    
    const getPublicUser = useCallback(async() => {
        try {
            abortControllerRef.current = new AbortController()
            const response = await apiCaller.getPublicUser(username, abortControllerRef.current.signal)
            if(!response?.success) return

            setPublicUser(response.public_user)

        } catch (error) {
            //
        }
    }, [abortControllerRef, username])

    useEffect(() => {
        
        getPublicUser()
        return ( ) => {
            abortControllerRef.current?.abort()
        }
    }, [getPublicUser, abortControllerRef])

    return publicUser
}

export default useGetPublicUser