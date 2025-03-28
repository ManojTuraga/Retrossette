/******************************************************************************
Module: PlayMusic.js
Creation Date: February 18th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga, Ceres Botkin

Description:
    This page defines the rendering behavior of the image grid that appears
    on both the search for songs component and the currently selected song
    component

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
// From the react library import the React framework
// and the useEffect and useState functions
import React, { useEffect, useState } from 'react';

// Import the Spotify Web Player
import SpotifyPlayer from './SpotifyPlayer';

// Import the socket created in the socket component
import { SOCKET } from '../components/socket';

/*******************************************************************************
PROCEDURES
*******************************************************************************/
/*
* This function handles the rendering for the spotify
* web player
*/
function PlayMusic() {
    // Create a state variable to hold the list of songs to play
    const [listOfSongs, setListOfSongs] = useState([]);

    // Create a state variable to hold the user's API token
    const [authToken, setAuthToken] = useState('');

    // Define the side effect for this component
    useEffect(() => {
            let playlistID = Number(localStorage.getItem('playlist_id')) || 0;

            /// Get the Songs that we need to play for this playlist
            SOCKET.emit("/api/get_songs_from_playlist", { message: playlistID }, (response) => {
                setListOfSongs(response["message"]);
            });
    
            // Get the API token for the user
            SOCKET.emit("/api/get_api_token", {}, (response) => {
                setAuthToken(response["message"]);
            });
        }, []);

    // Render the componenet
    return (
        <>
        { ( authToken === '' ) ? <h1>Logging in</h1> : <SpotifyPlayer token={authToken} listOfSongs={listOfSongs}/> }
        </>
    );
}

// Export this component
export default PlayMusic;
