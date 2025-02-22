import React, { useState } from 'react';
import "../css/CreatePlaylist.css";
import CassetteSection from './CassetteSection';
import ImageGrid from './ImageGrid';

import { SOCKET } from './socket';

const MAX_TIME_IN_MS = 3600000

function CreatePlaylist ()
    {
    const [searchInput, setSearchInput] = useState('');
    const [totalDuration, setTotalDuration] = useState(0);
    const [currSelectedSongs, setCurrSelectedSongs] = useState([]);
    const [searchedSongs, setSearchedSongs] = useState([]);

    function handleSearchBarChange( e )
        {
        setSearchInput( e.target.value );
        }

    function sendSearchQuery( e )
        {
        e.preventDefault();
        SOCKET.emit( "/api/search_for_song", { message: searchInput.trim() }, ( response ) => 
            { 
            let newElements = [];
            for( let song of response[ "items" ] ) 
                {
                console.log( song )
                newElements.push(
                    {
                    name: song[ "name" ],
                    uri: song[ "uri" ],
                    duration_ms: song[ "duration_ms" ],
                    image: song[ "album" ][ "images" ][ 0 ][ "url" ],
                    artists: song[ "artists" ].map( s => s[ "name" ] )
                    });
                }
                setSearchedSongs(newElements);
            } );
        }

    function updateTotalDuration( inc )
        {
        setTotalDuration( totalDuration + inc );
        }

    function updateFromCurrSelectedSongs( song, index )
        {
        updateTotalDuration( 0 - Number( song[ "duration_ms" ] ) );

        let newList = [...currSelectedSongs];
        newList.splice( index, 1 );
        setCurrSelectedSongs( newList );
        }

    function updateFromSearchedSongs( song, index )
        {

        setCurrSelectedSongs( [...currSelectedSongs, song ] );
        updateTotalDuration( Number( song[ "duration_ms" ] ) );
        }

  return (
    <div className="app">
    <div className="section top-left">
        <CassetteSection progressPercent={( totalDuration/MAX_TIME_IN_MS ) * 100}/>
      </div>
      <div className="section top-right">
        <ImageGrid onImageClick={updateFromCurrSelectedSongs} listOfSongs={currSelectedSongs}/>
      </div>
      <div className="section bottom-left">
        <ImageGrid onImageClick={()=>{}} listOfSongs={[]}/>
      </div>
      <div className="section bottom-right">
        <input type="text" value={searchInput} onChange={ handleSearchBarChange } placeholder="Enter search term..." />
        <button type="submit" disabled={searchInput.trim().length === 0} onClick={ sendSearchQuery }> Submit</button>
        <ImageGrid onImageClick={updateFromSearchedSongs} listOfSongs={searchedSongs}/>
      </div>
    </div>
  );
};

export default CreatePlaylist;