import React, { useState } from 'react';
import "../css/CreatePlaylist.css";
import CassetteSection from './CassetteSection';
import ImageGrid from './ImageGrid';
import cassetteImage from '../cassette.jpg';

import { SOCKET } from './socket';

const MAX_TIME_IN_MS = 3600000

function CreatePlaylist ()
    {
    const [searchInput, setSearchInput] = useState('');
    const [playlistNameInput, setPlaylistNameInput] = useState('');
    const [totalDuration, setTotalDuration] = useState(0);
    const [currSelectedSongs, setCurrSelectedSongs] = useState([]);
    const [searchedSongs, setSearchedSongs] = useState([]);

    function handleSearchBarChange( e )
        {
        setSearchInput( e.target.value );
        }

    function handlePlaylistNameChange( e )
        {
        setPlaylistNameInput( e.target.value );
        }

    function sendPlaylist( e )
        {
        e.preventDefault();
        SOCKET.emit( "/api/submit_playlist", { message : { name : playlistNameInput, songs : currSelectedSongs } }, ( response ) =>
            {
            window.location.href = response[ "post_submit_url" ];    
            } )
        }

    function sendSearchQuery( e )
        {
        e.preventDefault();
        SOCKET.emit( "/api/search_for_song", { message: searchInput.trim() }, ( response ) => 
            { 
            let newElements = [];
            for( let song of response[ "items" ] ) 
                {
                newElements.push(
                    {
                    name: song[ "name" ],
                    uri: song[ "uri" ],
                    duration_ms: song[ "duration_ms" ],
                    image: song[ "album" ][ "images" ][ 0 ][ "url" ],
                    artists: song[ "artists" ].map( s => s[ "name" ] ),
                    song_type: 0
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
    <div className='app'>
	<div className='current_cassette'>
	    <div>Cassette Picture/Picture Selection<br></br>
		<input type="text" value={playlistNameInput} onChange={ handlePlaylistNameChange } placeholder="Enter playlist name..." />
		<button type="submit" disabled={(playlistNameInput.trim().length === 0) || ( currSelectedSongs.length === 0 )} onClick={ sendPlaylist }> Submit</button> <br></br>
		<img src={cassetteImage} alt="Cassette" className="cassette-image" />
	    </div>
	    <div>
		<CassetteSection progressPercent={( totalDuration/MAX_TIME_IN_MS ) * 100}/>
	    </div>
	    <div style={{position:'relative'}}>
		<ImageGrid onImageClick={updateFromCurrSelectedSongs} listOfSongs={currSelectedSongs} isTrackSelection={true}/>
	    </div>
	</div>
	<div>
	    Search Bar<br></br>
	    <input type="text" value={searchInput} onChange={ handleSearchBarChange } placeholder="Enter search term..." />
	    <button type="submit" disabled={searchInput.trim().length === 0} onClick={ sendSearchQuery }> Submit</button>
	</div>
	<div className='song_selection'>
	    <ImageGrid onImageClick={updateFromSearchedSongs} listOfSongs={searchedSongs} isTrackSelection={false}/>
	</div>
    </div>
);
};

export default CreatePlaylist;
