import React, {useState, useEffect, useCallback, useRef} from "react";
import apiCaller from "../lib/apiCaller";


function useGetUserCredits(): {credits: number | null, refetch: () => Promise<void>} {
    const [credits, setCredits] = useState<null | string | number>(null)
    const controllerRef = useRef(new AbortController())

    const getCredits = useCallback(async() => {
        try {
            const response = await apiCaller.getCredits(controllerRef.current.signal)
            if(!response?.success) return

            setCredits(response.credits)
        } catch(err) {
            //
        }

    }, [setCredits, controllerRef])

    useEffect(() => {
        getCredits()

        return(() => {
            controllerRef.current.abort()
        })
    }, [getCredits])

    return {
        credits: credits ? parseInt(`${credits}`) :  null,
        refetch: getCredits
    }
}

export default useGetUserCredits