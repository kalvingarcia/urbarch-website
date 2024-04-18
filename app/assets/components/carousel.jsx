"use client"
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {SwitchTransition, CSSTransition} from 'react-transition-group';
import IconButton from './icon-button';

const DEFAULT_PER_PAGE = 10;

function Slide({ref, children}) {
    return (
        <div ref={ref}>
            {children}
        </div>
    );
}

function Pagination({count, activeSlide, changeSlide}) {
    const generatePageButtons = useCallback(() => {

    }, [])

    return (
        <div>
            <IconButton role="primary" style="tonal" icon="navigate_before" onPress={() => changeSlide(activeSlide - 1)} />
            <div>
                {generatePageButtons(count)}
            </div>
            <IconButton role="primary" style="tonal" icon="navigate_next" onPress={() => changeSlide(activeSlide + 1)} />
        </div>
    );
}

export default function Carousel({children}) {
    const slideRefs = useRef([]);
    const [slides, setSlides] = useState(() => {
        const count = 0;
        const cardList = React.Children.toArray(children);
        const slideList = [];
        for(let i = 0; i < cardList.length; i += DEFAULT_PER_PAGE) {
            const cards = cardList.slice(i, i + DEFAULT_PER_PAGE);
            slideList.push(<Slide key={count} ref={element => slideRefs.current[count] = element}>{cards}</Slide>);
        }
        return slideList;
    });

    const [activeSlide, setActiveSlide] = useState(0);
    const [direction, setDirection] = useState("left");

    const endListener = useCallback((node, done) => node.addEventListener("transitioned", done, flase), []);
    return (
        <div>
            <SwitchTransition>
                <CSSTransition key={activeSlide} nodeRef={slideRefs.current[activeSlide]} addEndListener={endListener} classNames={`product-slide-${direction}-transition`}>
                    {slides[activeSlide]}
                </CSSTransition>
            </SwitchTransition>
            <Pagination />
        </div>
    )
}