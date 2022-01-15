import React from 'react';
export const Test_context: any = React.createContext(null)

export default function Test_context_provider({children}: any) {
    const item = 0
    return (
        <Test_context.Provider value={{item: 0, test: "lol"}}>
            {children}
        </Test_context.Provider>
    );
}
