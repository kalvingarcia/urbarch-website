'use client'
import {useState, useCallback, createContext} from 'react';

export const DarkModeContext = createContext();

export default function Theme({defaultDarkMode, setDarkModeCookie, children}) {
    const [darkMode, setDarkMode] = useState(defaultDarkMode); // This keeps track of dark mode
    // The function to toggle dark mode
    const toggleDarkMode = useCallback(async () => {
        setDarkMode(!darkMode);
        await setDarkModeCookie(!darkMode);
    }, [darkMode]); // Here we will optain 2 cached functions

    // We send darkMode and toggleDarkMode so that any component can access the darkMode information and change it
    return (
        <DarkModeContext.Provider value={[darkMode, toggleDarkMode]}>
            <div className={darkMode? 'theme--dark' : 'theme--light'}>
                <div className="root">
                    {children}
                </div>
            </div>
        </DarkModeContext.Provider>
    );
}

