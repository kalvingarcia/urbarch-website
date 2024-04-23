"use client"
import {useContext, useState} from 'react';
import {QueryContext} from './query-handler';
import IconButton from "./icon-button";
import '../styles/components/search.scss';

export default function Search() {
    const {setSearch} = useContext(QueryContext);
    const [text, setText] = useState("");

    return (
        <div className='search'>
            <input className="textbox" name="search" onChange={event => setText(event.target.value)} />
            <div className="divider" />
            <IconButton role="secondary" style="text" icon="search" onPress={() => setSearch(text)} />
        </div>
    );
}