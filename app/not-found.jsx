'use client'
import Image from "next/image";
import {useEffect, useState} from "react";
import image from './assets/images/backgrounds/custom.png';
import './assets/styles/pages/error.scss';
import Button from "./assets/components/button";
import IconButton from "./assets/components/icon-comp";

export default function NotFound({error, reset}) {
    useEffect(() => {
        console.log(error);
    }, [error])

    return (
        <main className="error-splash">
            <figure className='background-container'>
                <Image className='background-image' src={image} alt="Error background image" />
            </figure>
            <div className='overlay' />
            <div className='content'>
                <span className="heading">404 Error</span>
                <span className="message">The page you were looking for could not be found. If you think this message was given to you in error, please report it to us!</span>
                <div className="buttons">
                    <IconButton role="error" style="text" icon="bug_report" onPress={() => location.href = "https://forms.gle/6oKdNJisFe6cXYX58"}/>
                    <Button role="error" style="filled" onPress={() => window.history.back()}>Go Back</Button>
                </div>
            </div>
        </main>
    );
}