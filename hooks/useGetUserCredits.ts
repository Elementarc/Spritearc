import React, {useState, useEffect} from "react";
import apiCaller from "../lib/apiCaller";


function useGetUserCredits(): number | null {
    const [credits, setCredits] = useState<null | string | number>(null)

    useEffect(() => {
        const controller = new AbortController()

        const credits = async() => {
            try {
                const response = await apiCaller.getCredits(controller.signal)
                if(!response?.success) return

                setCredits(response.credits)
            } catch(err) {
                //
            }
        }

        credits()

        return(() => {
            controller.abort()
        })
    }, [setCredits])

    return credits ? parseInt(`${credits}`) :  null
}

export default useGetUserCredits