import React, {useState, useEffect} from 'react';
export const Device_context: React.Context<{is_mobile: boolean | null}> = React.createContext<{is_mobile: boolean| null}>({
    is_mobile: null
})

export default function Device_context_provider({children}: any) {
    //Setting IsDesktop to tell other Components if App is mobileDevice or DesktopDevice
    const [is_mobile, set_is_mobile] = useState<null | boolean>(null)
    
    //Checks if Application IsDesktop or not
    useEffect(() => {
        history.scrollRestoration = "manual"

        function checkApplicationWidth(){
            const deviceWidth = window.innerWidth

            if(deviceWidth > 768){
                set_is_mobile(false)
            } else {
                set_is_mobile(true)
            }
        }

        checkApplicationWidth()
        
        window.addEventListener("resize", checkApplicationWidth)
        return(() => {
            window.removeEventListener("resize", checkApplicationWidth)
        })
    }, [set_is_mobile]);

    return (
        <Device_context.Provider value={{is_mobile}}>
            {children}
        </Device_context.Provider>
    );
}
