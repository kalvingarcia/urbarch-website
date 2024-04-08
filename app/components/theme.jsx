'use client'
import React, {useState, useCallback, createContext} from 'react';
import {ThemeProvider} from 'react-jss';

export const DarkModeContext = createContext();

const sea_salt = "#F6F6F6"; // Light Font Color or Light Background Color
const raisin_black = "#1C1E26"; // Dark Font Color or Dark Background Color

const platinum = "#EBEBEC"; // Light Surface Color
const onyx = "#1D212F"; // Dark Surface Color

const alice_blue = "#E0F0F6"; // Primary Light Color
const air_force = "#799EB3"; // Primary Mid Color
const prussian_blue = "#113A54"; // Primary Dark Color

const alabaster = "#E8E8DA"; // Secondary Light Color
const flax = "#C8AD6C"; // Secondary Mid Color
const lion = "##AB8F5C"; // Secondary Dark Color

const clot = "#C2AEAE"; // Error Light Color
const wine = "#4F1E2B"; // Error Dark Color

// The theme on Light Mode
const lightTheme = {
    title: prussian_blue,
    subtitle: flax,
    heading: air_force,
    subheading: flax,
    body: raisin_black,

    lightFont: sea_salt,
    darkFont: raisin_black,

    background: sea_salt,
    surface: platinum,

    primary: alice_blue,
    onPrimary: prussian_blue,
    secondary: alabaster,
    onSecondary: flax,

    error: wine,
    onError: clot
};

// // The theme on Dark Mode
// const darkTheme = {
//     title: alice_blue,
//     subtitle: flax,
//     heading: air_force,
//     subheading: alabaster,
//     body: sea_salt,

//     lightFont: sea_salt,
//     darkFont: raisin_black,

//     background: raisin_black,
//     surface: onyx,

//     primary: prussian_blue,
//     onPrimary: alice_blue,
//     secondary: lion,
//     onSecondary: alabaster,

//     error: clot,
//     onError: wine
// };

export default function Theme({children}) {
    const [theme, setTheme] = useState(lightTheme); // We set the default theme to light mode
    
    const [darkMode, setDarkMode] = useState(false); // This keeps track of dark mode
    // The function to toggle dark mode
    const toggleDarkMode = useCallback(() => {
        if(darkMode) // If in dark mode
            setDarkMode(false); // Become light mode
        else // If light mode
            setDarkMode(true); // Become dark mode
    }, [darkMode]); // Here we will optain 2 cached functions

    // We send darkMode and toggleDarkMode so that any component can access the darkMode information and change it
    return (
        <DarkModeContext.Provider value={[darkMode, toggleDarkMode]}>
            <ThemeProvider theme={theme}>
                <div className={darkMode? 'theme--dark' : 'theme--light'}>
                    <div className="body">
                        {children}
                    </div>
                </div>
            </ThemeProvider>
        </DarkModeContext.Provider>
    );
}

