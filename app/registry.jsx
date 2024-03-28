'use client'
import React, {useState} from 'react';
import {useServerInsertedHTML} from 'next/navigation';
import {SheetsRegistry, JssProvider, createGenerateId} from 'react-jss';

export default function Registry({children}) {
    const [registry] = useState(() => new SheetsRegistry());
    const [generateId] = useState(() => createGenerateId());
    
    useServerInsertedHTML(() => <style>{registry.toString()}</style>);

    return <JssProvider registry={registry} generateId={generateId}>{children}</JssProvider>
}