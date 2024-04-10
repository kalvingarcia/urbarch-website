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
    const unhide = useCallback(() => {
        setHide(false); // We unhide the hero's content
    }, []);

    return (
        <section className={['hero', hide? "hide" : ""].join(" ")} onMouseMove={() => unhide()}>
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
