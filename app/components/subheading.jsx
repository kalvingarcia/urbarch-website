"use client"
import React from 'react';
import {createUseStyles} from 'react-jss';

const useStyles = createUseStyles(theme => ({
    subheading: {
        color: theme.subheading,
        fontSize: "1.2rem",
        fontWeight: "bold"
    }
}));

export default function Subheading({children}) {
    const styles = useStyles();
    return (
        <h4 className={styles.subheading}>{children}</h4>
    );
}