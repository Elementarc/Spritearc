import React, {useState, useEffect, useCallback, useRef} from "react";
import apiCaller from "../lib/apiCaller";


function useGetUserCredits(): {credits: number | null, refetch: () => Promise<void>} {
    const [credits, setCredits] = useState<null | string | number>(null)
    const controllerRef = useRef<null | AbortController>(null)

    const getCredits = useCallback(async() => {
        controllerRef.current = new AbortController()
        try {
            const response = await apiCaller.getCredits(controllerRef.current.signal)
            if(!response?.success) return

            setCredits(response.credits)
        } catch(err) {
            console.log(err)
            //
        }

    }, [setCredits, controllerRef])

    useEffect(() => {
        getCredits()
    }, [getCredits])

    useEffect(() => {
        
        return(() => {
            if(controllerRef.current) controllerRef.current.abort()
        })
    }, [controllerRef])
    return {
        credits: credits ? parseInt(`${credits}`) :  null,
        refetch: getCredits
    }
}

export default useGetUserCredits