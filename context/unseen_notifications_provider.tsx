import React, {useEffect, useState} from "react";
export const Unseen_notification_context: any = React.createContext(null)

export interface IUnseen_notification_context_provider {
    unseen_notifications: number,
    set_unseen_notifications: React.Dispatch<React.SetStateAction<number>>
}

export default function Unseen_notification_context_provider({children}: any) {
    //App notification reducer. Used to create app_notifications.
    const [unseen_notifications, set_unseen_notifications] = useState(0)
    
    useEffect(() => {
        const controller = new AbortController()
        let timer: any = 0
        async function get_unseen_notification_count() {
            
            try {

                const response = await fetch(`${process.env.NEXT_PUBLIC_SPRITEARC_API}/user/unseen_notifications_count`, {
                    method: "POST",
                    signal: controller.signal,
                    credentials: "include",
                })

                const response_obj = await response.json()
                set_unseen_notifications(response_obj.unseen_notifications)
                
            } catch(err) {
                //
            }  
        }

        get_unseen_notification_count()

        timer = setInterval(async() => {
            get_unseen_notification_count()
        }, 1000 * 30)

        return(() => {
            clearTimeout(timer)
            controller.abort()
            
        })
    }, [])

    return (
        <Unseen_notification_context.Provider value={{unseen_notifications: unseen_notifications, set_unseen_notifications: set_unseen_notifications}}>
            {children}
        </Unseen_notification_context.Provider>
    );
    
}


