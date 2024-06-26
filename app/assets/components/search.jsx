"use client"
import {useContext, useState} from 'react';
import {QueryContext} from './query-handler';
import IconButton from "./icon-button";
import useRippleEffect from '../hooks/ripple';
import '../styles/components/search.scss';

export default function Search() {
    const [rippleExpand, rippleFade] = useRippleEffect();
    const {getSearch, setSearch, applyRoute} = useContext(QueryContext);
    const [text, setText] = useState(getSearch);

    return (
        <div className='search' onMouseDown={rippleExpand} onMouseUp={rippleFade} onClick={event => event.target.getElementsByClassName('textbox')[0]?.focus()}>
            <input className="textbox" name="search" value={text} onChange={event => setText(event.target.value) || setSearch(event.target.value)} placeholder='Search (e.g. Product ID, Name, Style, etc.)' />
            <div className="divider" />
            <IconButton role="primary" style="text" icon="search" onPress={applyRoute} />
        </div>
    );
}