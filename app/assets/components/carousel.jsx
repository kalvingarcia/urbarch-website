"use client"
import React, {useState, useEffect, useCallback, createRef, forwardRef, memo} from 'react';
import Button from './button';
import IconButton from './icon-button';

const DEFAULT_PER_PAGE = 15;

function Slide({children}) {
    return (
        <div className='slide'>
            {children}
        </div>
    );
}

function PageButton({number, ...props}) {
    return (
        <Button className="page-button" {...props}>
            {number}
        </Button>
    );
}

function Pagination({count, activeSlide, changeSlide}) {
    const generatePageButtons = useCallback(count => {
        const pageButtons = [];
        for(let i = 0; i < count; i++)
            pageButtons.push(<PageButton key={i} role="primary" style={activeSlide === i? "filled" : "outlined"} onPress={() => changeSlide(i)} number={i + 1} />);
        return pageButtons;
    }, [activeSlide]);

    return (
        <div className='pagination'>
            <IconButton className="left" role="primary" style="tonal" icon="navigate_before" onPress={() => changeSlide(activeSlide - 1)} />
            <div>
                {generatePageButtons(count)}
            </div>
            <IconButton className="left" role="primary" style="tonal" icon="navigate_next" onPress={() => changeSlide(activeSlide + 1)} />
        </div>
    );
}

export default function Carousel({children}) {
    const [slides] = useState(() => {
        let count = 0;
        const cardList = React.Children.toArray(children);
        const slides = [];
        for(let i = 0; i < cardList.length; i += DEFAULT_PER_PAGE) {
            const cards = cardList.slice(i, i + DEFAULT_PER_PAGE);
            slides.push(<Slide key={count}>{cards}</Slide>);
            count++;
        }
        return slides;
    });

    const [activeSlide, setActiveSlide] = useState(0);
    const [direction, setDirection] = useState("left");
    const changeSlide = useCallback(nextSlide => {
        if(nextSlide === activeSlide)
            return;

        nextSlide = nextSlide > slides.length - 1? slides.length - 1 : nextSlide;
        nextSlide = nextSlide < 0? 0 : nextSlide;
        
        if(nextSlide > activeSlide)
            setDirection("right");
        else
            setDirection("left");
        console.log(activeSlide, nextSlide);
        setActiveSlide(nextSlide);
    }, [direction]);

    return (
        <div className='carousel'>
            {slides[activeSlide]}
            <Pagination count={slides.length} activeSlide={activeSlide} changeSlide={changeSlide} />
        </div>
    )
}