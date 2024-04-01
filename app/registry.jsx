"use client"
import React, {useState} from 'react';
import {useServerInsertedHTML} from 'next/navigation';
import {SheetsRegistry, JssProvider, createGenerateId} from 'react-jss';


/**
 * This React component is specifically made using the React-JSS tutorial on NextJS.
 * The structure in the NextJS GitHub is for the pages routing style, not the app directory,
 * so the tutorial needed to be adapted to the app directory, which was simple after
 * reading the NextJS tutorial on creating registries for other CSS-in-JS libraries.
 * 
 * @param children - the list of React elements that the registry is a parent of.
 * @returns The JSS context provider for JSS styling.
 */
export default function Registry({children}) {
    const [registry] = useState(() => new SheetsRegistry());
    const [generateId] = useState(() => createGenerateId());
    
    useServerInsertedHTML(() => <style id="server-side-styles" type="text/css">{registry.toString()}</style>);

    return <JssProvider registry={registry} generateId={generateId}>{children}</JssProvider>
}