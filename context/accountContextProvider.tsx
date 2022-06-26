import React, { useCallback, useEffect, useRef, useState } from "react"
import apiCaller from "../lib/apiCaller"
import { PublicUser } from "../types"

export interface IAccountContext {
    publicUser: PublicUser | undefined | null
    refresh: () => void
}
export const AccountContext = React.createContext<null | {publicUser: PublicUser | null | undefined, refresh: () => void}>(null)

export default function AccountContextProvider({children}: any) {
    const [publicUser, setPublicAccount] = useState<null | undefined | PublicUser>(undefined)
    const abortControllerRef = useRef<null | AbortController>(null)

    const refresh = useCallback(async() => {
        
        try {
            abortControllerRef.current = new AbortController()
            const response = await apiCaller.isAuth(abortControllerRef.current.signal)
            
            if(!response?.success) {
                setPublicAccount(null)
                return
            }

            setPublicAccount(response?.public_user)
        } catch (error) {
            //Nothing
        }
        
    }, [setPublicAccount, abortControllerRef, apiCaller])
    
    useEffect(() => {
        refresh()
    }, [refresh])

    useEffect(() => {
      return () => {
        abortControllerRef.current?.abort()
      };
    }, [abortControllerRef])
    
    const accountProvider: IAccountContext = {
        publicUser,
        refresh
    }

    return (
        <AccountContext.Provider value={accountProvider}>
            {children}
        </AccountContext.Provider>
    );
}