import React, { useState } from 'react';

import { SOCKET } from './socket.js'

const SearchBar = () => {
    const [searchInput, setSearchInput] = useState('');
    const [elements, setElements] = useState([]);

    const handleChange = (e) => {
        setSearchInput(e.target.value);
    };

    function addElements(songsArray) {
        let newElements = [];
        for (let song of songsArray) {
            console.log( song )
            newElements.push({
                name: song["name"],
                uri: song["uri"],
                duration_ms: song["duration_ms"],
                image: song[ "album" ][ "images" ][ 0 ],
                artists: song["artists"].map(s => s["name"])
            });
        }
        setElements(newElements);
    }

    function sendSearchQuery( e )
        {
        e.preventDefault();
        SOCKET.emit( "/api/search_for_song", { message: searchInput.trim() }, ( response ) => { addElements( response[ "items" ] ) } );
        }

    const isSubmitDisabled = searchInput.trim().length === 0;

    return (
        <form onSubmit={sendSearchQuery}>
            <input
                type="text"
                value={searchInput}
                onChange={handleChange}
                placeholder="Enter search term..."
            />
            <button type="submit" disabled={isSubmitDisabled} onClick={ sendSearchQuery }>
                Submit
            </button>
            <ul>
                {elements.map((element, index) => (
                    <>
                    <li key={index}>{element[ "name" ]}</li>
                        <ul>
                            <li><img src={element["image"][ "url" ]} height={element["image"][ "height" ]} width={element["image"][ "width" ]}/></li>
                            <li>{element[ "uri" ]}</li>
                            <li>{element[ "duration_ms" ]}</li>
                            <li>artists</li>
                                <ul>
                                    {
                                    element[ "artists" ].map( ( artist, i ) => ( 
                                        <li key={i}>{ artist }</li> ))}
                                </ul>
                        </ul>
                    </>
                ))}
            </ul>
        </form>
    );
};

export default SearchBar;
