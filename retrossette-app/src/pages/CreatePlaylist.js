/******************************************************************************
Module: CreatePlaylist.js
Creation Date: February 18th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga, Ceres Botkin

Description:
    This page defines the rendering behavior of the CreatePlaylist section
    of the app. Here, the user can define the songs that are in a playlist
    and hte name of the playlist

Inputs:
    None

Outputs:
    React Component 

Preconditions:
    A server running on the flask environment must be active
    
Postconditions:
    Unknown

Error Conditions:
    None

Side Effects:
    Interactions on the webpage may lead to changes in database state

Invariants:
    There will only be on instance of the server running at all times

Known Faults
    None
    
Sources: React Documentation, Socketio Documentation
******************************************************************************/

/*******************************************************************************
IMPORTS
*******************************************************************************/
// From the react library, import the React framework and the use state
// function
import React, { useState } from 'react';

// Import the required componenets for this page
import CassetteSection from './CassetteSection';
import ImageGrid from './ImageGrid';
import Slider from '../components/slider';

// Import the styling for this page
import '../css/CreatePlaylist.css';

// Import the socket io object created in the socket componenet
import { SOCKET } from '../components/socket';

// Source: https://lovepik.com/image-380224947/vintage-tape-recorder-old-mix-print.html 
import cassetteImage from '../cassette.jpg';

import {zip} from 'lodash'
import cassette from '../images/cassette_svg.svg'

/*******************************************************************************
VARIABLES
*******************************************************************************/
// Define a variable to determine the maximum capacity
// of a cassette (in milliseconds)
const MAX_TIME_IN_MS = 3600000

/*******************************************************************************
PROCEDURES 
*******************************************************************************/
/*
* This function defines the rendering behavior of the Create Playlists
* Componenet of the page
*/
function CreatePlaylist ()
    {
    // Define a state variable to hold the value
    // of the serch input
    const [searchInput, setSearchInput] = useState('');
   
    // Define a state variable to hold the value o fhte
    // playlist name input
    const [playlistNameInput, setPlaylistNameInput] = useState('');
    
    // Define a state variable to hold the value of the total
    // duration of the music
    const [totalDuration, setTotalDuration] = useState(0);
    
    // Define a state variable to hold the songs that are
    // Currently selected to be in the playlist
    const [currSelectedSongs, setCurrSelectedSongs] = useState([]);
    
    // Define a state variable to hold the songs that we
    // currently searched for
    const [searchedSongs, setSearchedSongs] = useState([]);

    const [allGenres, setAllGenres] = useState([]);

    const [genreAssociationValues, setGenreAssociationValues] = useState([]);

    const [genreDropdownValues, setGenreDropdownValues] = useState([]);

    SOCKET.emit( "/api/get_all_genres", { }, ( response ) =>
        {
        setAllGenres( response[ "message" ] );  
        } )

    // Define a local function to handle changes to the input
    // in the search bar
    function handleSearchBarChange( e )
        {
        setSearchInput( e.target.value );
        }

    // Define a local function to handle changes to the input
    // in the search bar
    function handlePlaylistNameChange( e )
        {
        setPlaylistNameInput( e.target.value );
        }

    // Define a local function to handle a click on the submit
    // button
    function sendPlaylist( e )
        {
        // Prevent the default behavior on a button click
        e.preventDefault();

        // Send the playlist information to the server and on a response, redirect
        // to the specified page
        SOCKET.emit( "/api/submit_playlist", { message : { name : playlistNameInput, songs : currSelectedSongs, genres: zip( genreDropdownValues, genreAssociationValues ) } }, ( response ) =>
            {
            window.location.href = response[ "post_submit_url" ];    
            } )
        }

    // Define a local function that will handle searches for
    // music on spotify
    function sendSearchQuery( e )
        {
        // Prevent the default behavior when a button is clicked
        e.preventDefault();

        // Send the search query to the server and on the
        // response, add all the songs to the image grid
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
    
    // Local function to update the total duration of all the songs
    // that are selected to be in the playlist
    function updateTotalDuration( inc )
        {
        setTotalDuration( totalDuration + inc );
        }

    // Local function to update the current selected songs
    // when a song is clicked
    function updateFromCurrSelectedSongs( song, index )
        {
        // Reduce the total duration of the playlist
        updateTotalDuration( 0 - Number( song[ "duration_ms" ] ) );

        // Remove the song from the list of currently songs
        // while preserving the order of the rest of the songs
        let newList = [...currSelectedSongs];
        newList.splice( index, 1 );
        setCurrSelectedSongs( newList );
        }

    // Local function to update the currently selected songs when 
    // a song is added to the currently selected songs
    function updateFromSearchedSongs( song, index )
        {
        setCurrSelectedSongs( [...currSelectedSongs, song ] );
        updateTotalDuration( Number( song[ "duration_ms" ] ) );
        }
    
    // Render the components that are required for this page
    return (
        /*<div className='app'>
        <div className='current_cassette'>
            <div>Cassette Picture/Picture Selection<br></br>
            <input type="text" value={playlistNameInput} onChange={ handlePlaylistNameChange } placeholder="Enter playlist name..." />
            <button type="submit" disabled={(playlistNameInput.trim().length === 0) || ( currSelectedSongs.length === 0 ) || 
                ( genreDropdownValues.length === 0 ) || genreAssociationValues.reduce((acc, curr) => acc + Number(curr), 0) !== 100 } onClick={ sendPlaylist }> Submit</button> <br></br>
            <img src={cassetteImage} alt="Cassette" className="cassette-image" />
            <Slider allGenres={allGenres} values={ genreAssociationValues } setValues={setGenreAssociationValues} dropdownValues={genreDropdownValues} setDropdownValues={setGenreDropdownValues}/>
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
        </div>*/
        <div className="grid grid-rows-5 grid-cols-5 gap-x-4 mx-12 h-[calc(100vh-65px)]">
            <div className="col-start-1 col-span-2 row-start-1 row-span-3 ">
                <div className="grid grid-cols-1 content-start gap-4 bg-cyan-500 rounded-b-lg overflow-y-auto scrollbar-hide p-4 h-full">
                    <div className="col-span-full place-self-center text-white text-2xl">Cassette Name</div>
                    <img src={cassette} alt="" className="w-full h-auto col-span-full place-self-center col-span-1"/>
                </div>
            </div>
            
            <div className="col-start-1 col-span-2 row-start-4 row-span-2">
                <div className="grid sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 content-start gap-4 
                                bg-pink-700 rounded-b-lg  overflow-y-auto scrollbar-hide p-4 h-full">
                    <div className="grid grid-cols-5 col-span-full">
                        <div className="col-span-4">
                            <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-[#2b2b2b] overflow-hidden">
                                <div className="grid place-items-center h-full w-12 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                <input
                                className="ps-2 peer h-full w-full outline-none text-sm text-white pr-2 bg-[#3b3b3b]"
                                type="text"
                                id="search"
                                placeholder="Genres" /> 
                            </div>
                        </div>
                        <div className="my-auto mx-auto col-span-1 text-white text-2xl"></div>  
                    </div>  
                </div>
            </div>

            <div className="col-start-3 col-span-3 row-start-1 row-span-2">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 content-start gap-4 
                                bg-cyan-500 rounded-b-lg h-full overflow-y-auto scrollbar-hide p-4">
                    <div className="col-span-full text-white text-2xl">Songs</div>
                    
                    <div className="h-auto bg-pink-500 text-white aspect-square"></div>
                    <div className="h-auto bg-pink-500 text-white aspect-square"></div>
                    <div className="h-auto bg-pink-500 text-white aspect-square"></div>
                    <div className="h-auto bg-pink-500 text-white aspect-square"></div>
                    <div className="h-auto bg-pink-500 text-white aspect-square"></div>
                    <div className="h-auto bg-pink-500 text-white aspect-square"></div>
                    <div className="h-auto bg-pink-500 text-white aspect-square"></div>
                    <div className="h-auto bg-pink-500 text-white aspect-square"></div>
                </div>
            </div>

            

            <div className="col-start-3 col-span-3 row-start-3 row-span-3">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 content-start gap-4 
                            bg-pink-700 rounded-b-lg  overflow-y-auto scrollbar-hide p-4 h-full">
                    <div className="grid grid-cols-5 col-span-full">
                        <div className="col-span-2">
                            <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-[#2b2b2b] overflow-hidden">
                                <div className="grid place-items-center h-full w-12 text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>

                                <input
                                className="ps-2 peer h-full w-full outline-none text-sm text-white pr-2 bg-[#3b3b3b]"
                                type="text"
                                id="search"
                                placeholder="Search something.." /> 
                            </div>
                        </div>
                    </div>
                    <div className="h-auto bg-cyan-500 text-white aspect-square"></div>
                    <div className="h-auto bg-cyan-500 text-white aspect-square"></div> 
                    <div className="h-auto bg-cyan-500 text-white aspect-square"></div> 
                    <div className="h-auto bg-cyan-500 text-white aspect-square"></div> 
                    <div className="h-auto bg-cyan-500 text-white aspect-square"></div> 
                    <div className="h-auto bg-cyan-500 text-white aspect-square"></div> 
                    <div className="h-auto bg-cyan-500 text-white aspect-square"></div> 
                    <div className="h-auto bg-cyan-500 text-white aspect-square"></div> 
                    <div className="h-auto bg-cyan-500 text-white aspect-square"></div>     
                </div>
            </div>

        </div>
    );
};

// Export the componenet
export default CreatePlaylist;
