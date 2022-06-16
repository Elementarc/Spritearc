import React, {useEffect, useState} from 'react';
import { App_navigation_context_type } from '../types';
export const Navigation_context: any = React.createContext(null)

export default function Navigation_context_provider({children}: any) {
    const [nav_state, set_nav_state] = useState(false);

    const navigation: App_navigation_context_type = {
        nav_state,
        set_nav_state
    }
    
    useEffect(() => {
        if(nav_state) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
    }, [nav_state])
    return (
        <Navigation_context.Provider value={navigation}>
            {children}
        </Navigation_context.Provider>
    );
}
