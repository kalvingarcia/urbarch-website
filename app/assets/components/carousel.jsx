"use client"
import {useState, useCallback, Children, useEffect} from 'react';
import Button from './button';
import IconButton from './icon-button';
import useWindowSize from '../hooks/window';
import '../styles/components/carousel.scss';

const DEFAULT_PER_PAGE = 15;

function Slide({children}) {
    return (
        <div className='slide'>
            {children}
        </div>
    );
}

function PaginationGap() {
    return (
        <span className="page-button">...</span>
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
    const {width} = useWindowSize();
    const generatePageButtons = useCallback(count => {
        var buttonCount = 5;
        if(width <= 600)
            buttonCount = 3

        const pageButtons = [];

        if(count <= buttonCount) {
            for(let i = 0; i < count; i++)
                pageButtons.push(<PageButton key={i} role="primary" style={activeSlide === i? "filled" : "outlined"} onPress={() => changeSlide(i)} number={i + 1} />);
        } else if(activeSlide < buttonCount / 2) {
            for(let i = 0; i < buttonCount; i++)
                pageButtons.push(<PageButton key={i} role="primary" style={activeSlide === i? "filled" : "outlined"} onPress={() => changeSlide(i)} number={i + 1} />);
            pageButtons.push(<PaginationGap key="gap_right" />);
            pageButtons.push(<PageButton key={count - 1} role="primary" style={activeSlide === count - 1? "filled" : "outlined"} onPress={() => changeSlide(count - 1)} number={count} />);
        } else if(activeSlide > count - buttonCount / 2 - 1) {
            pageButtons.push(<PageButton key={0} role="primary" style={activeSlide === 0? "filled" : "outlined"} onPress={() => changeSlide(0)} number="1" />);
            pageButtons.push(<PaginationGap key="gap_left" />);
            for(let i = count - buttonCount; i < count; i++)
                pageButtons.push(<PageButton key={i} role="primary" style={activeSlide === i? "filled" : "outlined"} onPress={() => changeSlide(i)} number={i + 1} />);
        } else {
            pageButtons.push(<PageButton key={0} role="primary" style={activeSlide === 0? "filled" : "outlined"} onPress={() => changeSlide(0)} number="1" />);
            pageButtons.push(<PaginationGap key="gap_left" />);
            for(let i = activeSlide - (buttonCount - 3) / 2; i < activeSlide + (buttonCount -3) / 2 + 1; i++)
                pageButtons.push(<PageButton key={i} role="primary" style={activeSlide === i? "filled" : "outlined"} onPress={() => changeSlide(i)} number={i + 1} />);
            pageButtons.push(<PaginationGap key="gap_right" />);
            pageButtons.push(<PageButton key={count - 1} role="primary" style={activeSlide === count - 1? "filled" : "outlined"} onPress={() => changeSlide(count - 1)} number={count} />);
        }

        return pageButtons;
    }, [activeSlide, width]);

    return (
        <div className='pagination'>
            <IconButton className="left" role="primary" style="tonal" icon="navigate_before" onPress={() => changeSlide(activeSlide - 1)} />
            <div className='button-list'>
                {generatePageButtons(count)}
            </div>
            <IconButton className="left" role="primary" style="tonal" icon="navigate_next" onPress={() => changeSlide(activeSlide + 1)} />
        </div>
    );
}

export default function Carousel({children}) {
    const [slides, setSlides] = useState(() => {
        let count = 0;
        const cardList = Children.toArray(children);
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
    }, [activeSlide, direction]);

    useEffect(() => {
        let count = 0;
        const cardList = Children.toArray(children);
        const slides = [];
        for(let i = 0; i < cardList.length; i += DEFAULT_PER_PAGE) {
            const cards = cardList.slice(i, i + DEFAULT_PER_PAGE);
            slides.push(<Slide key={count}>{cards}</Slide>);
            count++;
        }
        setSlides(slides);
        setActiveSlide(0);
    }, [children]);

    return (
        <div className='carousel'>
            {slides[activeSlide]}
            <Pagination count={slides.length} activeSlide={activeSlide} changeSlide={changeSlide} />
        </div>
    )
}