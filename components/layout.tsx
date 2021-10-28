
import React, {useState, useEffect} from 'react';
import {AppContext} from "../types"
import Navigation from './navigation';

export const appContext: any = React.createContext(null)
export default function Layout( { children }: any) {
    //Setting IsDesktop to tell other Components if App is mobileDevice or DesktopDevice
    const [isDesktop, setIsDesktop] = useState(true)
    const [NavState, setNavState] = useState(false);
    //Context that gets Send to all childs
    const appContextObj: AppContext = {
        isDesktop: isDesktop,
        nav:  {
            navState: NavState,
            setNavState: setNavState,
        }
    }
    //Checks if Application IsDesktop or not
    useEffect(() => {
        function checkApplicationWidth(){
            const deviceWidth = window.innerWidth

            if(deviceWidth > 1024){
                setIsDesktop(true)
            } else {
                setIsDesktop(false)
            }
        }

        window.addEventListener("resize", checkApplicationWidth)
        return(() => {
            window.removeEventListener("resize", checkApplicationWidth)
        })
    }, []);

    
    return (
        <appContext.Provider value={appContextObj}>
            <div className="app_container" id="app_container">
                <Navigation/>
                <div className="app_content_container" id="app_content_container">
                    <div onClick={() => {setNavState(false)}} className="app_content_blur" id="app_content_blur"/>

                    <main>
                        {children}
                    </main>
                    
                </div>
            </div>
        </appContext.Provider>
    );
}
