import React, { useState } from "react";
import { IPopup } from "../components/popup";

export const PopupProviderContext = React.createContext<IPopupContext | null>(null) 

export interface IPopupContext {
    popup: IPopup | null,
    setPopup: React.Dispatch<React.SetStateAction<IPopup | null>>
}
export default function PopupProvider({children}: any) {
    const [popup, setPopup] = useState<null | IPopup>(null)
    
    return (
        <PopupProviderContext.Provider value={{popup, setPopup}}>
            {children}
        </PopupProviderContext.Provider>
    );
}


