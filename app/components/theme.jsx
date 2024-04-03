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
const vanilla = "#E7DAAB"; // Secondary Mid Color
const flax = "#E5CB7B"; // Secondary Dark Color

const clot = "#C2AEAE"; // Error Light Color
const wine = "#4F1E2B"; // Error Dark Color

const lightTheme = {
    title: prussian_blue,
    subtitle: flax,
    heading: air_force,
    subheading: vanilla,
    body: raisin_black,

    lightFont: sea_salt,
    darkFont: raisin_black,

    background: sea_salt,
    surface: platinum,

    primary: prussian_blue,
    onPrimary: alice_blue,
    secondary: flax,
    onSecondary: alabaster,

    error: wine,
    onError: clot
};

const darkTheme = {
    title: alice_blue,
    subtitle: flax,
    heading: air_force,
    subheading: alabaster,
    body: sea_salt,

    lightFont: sea_salt,
    darkFont: raisin_black,

    background: raisin_black,
    surface: onyx,

    primary: alice_blue,
    onPrimary: prussian_blue,
    secondary: alabaster,
    onSecondary: flax,

    error: clot,
    onError: wine
};

export default function Theme({children}) {
    const [theme, setTheme] = useState(lightTheme);
    const [darkMode, setDarkMode] = useState(false);
    const toggleDarkMode = useCallback(() => {
        if(darkMode) {
            setTheme(lightTheme);
            setDarkMode(false);
        } else {
            setTheme(darkTheme);
            setDarkMode(true);
        }
    }, [darkMode]);

    return (
        <DarkModeContext.Provider value={[darkMode, toggleDarkMode]} >
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </DarkModeContext.Provider>
    );
}

