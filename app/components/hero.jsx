"use client";
import Image from 'next/image';
import  {useCallback, useEffect, useState} from 'react';
import IconButton from './icon-button';
import background from '../assets/backgrounds/home.jpg';
import '../assets/styles/components/hero.scss';

export default function Hero({src, children}) {
    // Here we have a callback for showing the hero content on mouse move
    const [hide, setHide] = useState(true);
    const [timer, setTimer] = useState(undefined);
    const timedHide = useCallback(timer => {
        setHide(false); // We unhide the hero's content
        if(timer) // If there is a timer already
            clearTimeout(timer); // We stop it

        // Here we (re)set a timer for 5 seconds
        setTimer(setTimeout(() => {
            setHide(true);
            setTimer(undefined); // Set Timer to undefined by default
        }, 5000));
    }, []);

    return (
        <section className={['hero', hide? "hide" : ""].join(" ")} onMouseMove={() => timedHide(timer)}>
            <figure className='parallax-container'>
                <Image className='parallax-image' src={background} alt="Hompage background image" priority/>
            </figure>
            <div className='gradient' />
            <div className='content'>
                {children}
            </div>
            <div className='visibility'>
                <IconButton role="secondary" style="outlined" icon={hide? "visibility" : "visibility_off"} onPress={() => setHide(!hide)}/>
            </div>
        </section>
    );
}
