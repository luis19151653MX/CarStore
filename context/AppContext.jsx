import React, { createContext, useState} from 'react';

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
    const [appName, setAppName] = useState("Car Store");

    return (
        <AppContext.Provider value={{ appName,setAppName }}>
            {children}
        </AppContext.Provider>
    );
};
