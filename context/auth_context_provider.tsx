import React, {useReducer, useState, useEffect, useCallback} from "react";
export const Auth_context: any = React.createContext(null)


export default function Auth_context_provider({children}: any) {
    
    
    return (
        <Auth_context.Provider value={"user"}>
            {children}
        </Auth_context.Provider>
    );
}


