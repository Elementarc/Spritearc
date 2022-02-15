import React, {useReducer} from "react";
import {App_notification, App_dispatch_notification, App_notification_actions, App_notification_context_type} from "../types"
export const App_notification_context: any = React.createContext(null)
export const NOTIFICATION_ACTIONS: App_notification_actions = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    CLOSE: "CLOSE"
}


//Reducer function to handle notification state
function app_notification_reducer(state: App_notification, action: {type: string, payload: App_dispatch_notification | null}): any {
    const { type, payload } = action
    
    if(!type) return state

    switch ( type ) {

        case (NOTIFICATION_ACTIONS.SUCCESS) : {

            if(!payload) break
            
            state = {
                toggle: true,
                success: true,
                title: payload.title,
                message: payload.message,
                button_label: payload.button_label,
                callb: payload.callb
            }
            break
        }

        case (NOTIFICATION_ACTIONS.ERROR) : {

            if(!payload) break

            state = {
                toggle: true,
                success: false,
                title: payload.title,
                message: payload.message,
                button_label: payload.button_label,
                callb: payload.callb
            }
            break
        }

        case (NOTIFICATION_ACTIONS.CLOSE) : {
            state = {
                toggle: false,
                success: false,
                title: null,
                message: null,
                button_label: null,
                callb: () => {}
            }
            break
        }

        default : {
            break
        }

    }

    return {...state}
}

const init_notification_obj: App_dispatch_notification = {
    title: null,
    message: null,
    button_label: null,
    callb: () => {}
}

export default function App_notification_context_provider({children}: any) {
    //App notification reducer. Used to create app_notifications.
    const [notification, dispatch] = useReducer(app_notification_reducer, init_notification_obj)

    const app_notification_obj: App_notification_context_type = {
        notification,
        dispatch
    }
    
    return (
        <App_notification_context.Provider value={app_notification_obj}>
            {children}
        </App_notification_context.Provider>
    );
    
}


