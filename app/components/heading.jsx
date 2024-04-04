"use client"
import React from 'react';
import {createUseStyles} from 'react-jss';

const useStyles = createUseStyles(theme => ({
    heading: {
        color: theme.heading,
        fontSize: "1.5rem",
        fontWeight: "bold"
    }
}));

export default function Heading({children}) {
    const styles = useStyles();
    return (
        <h3 className={styles.heading}>{children}</h3>
    );
}