'use client'
import Image from "next/image";
import {useEffect, useState} from "react";
import image from './assets/images/backgrounds/custom.png';
import './assets/styles/pages/error.scss';
import Button from "./assets/components/button";

export default function Error({error, reset}) {
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
                <span className="heading">Oh no!</span>
                <span className="message">{error.message}</span>
                <div className="buttons">
                    <Button role="error" style="text" onPress={() => reset()}>Retry</Button>
                    <Button role="error" style="filled" onPress={() => window.history.back()}>Go Back</Button>
                </div>
            </div>
        </main>
    );
}