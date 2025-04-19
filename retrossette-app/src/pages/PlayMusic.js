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

// Import the ability to read parameters in the url
import { useSearchParams } from 'react-router-dom'

// Import the Spotify Web Player
import SpotifyPlayer from './SpotifyPlayer';

// Import the socket created in the socket component
import { SOCKET } from '../components/socket';

// Import the review form
import ReviewForm from '../components/ratings';

import CassetteDisplay from '../components/casetteDisplay';

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

    // Define a state variable to hold the user rating
    const [rating, setRating] = useState(0);

    // Define a state variable to hold the users comment
    const [comment, setComment] = useState("");

    // Define a state variable to hold the parameters from the URL
    const [searchParams] = useSearchParams();

    // Define a state variable to hold the error state
    const [errState, setErrState] = useState(false);

    // Get the playlist ID from the search params
    let playlistID = searchParams.get('id') || 0;

    // Define a function that will update the rating of
    // the user on a submission
    function handleReviewSubmit(rating, comment) {
        SOCKET.emit("/api/update_rating_for_playlist", { message: { stars: rating, comment: comment, playlist_id: playlistID } }, (response) => { })
    }

    // Define the side effect for this component
    useEffect(() => {
        /// Get the Songs that we need to play for this playlist
        SOCKET.emit("/api/get_songs_from_playlist", { message: playlistID }, (response) => {
            if (response["status"] === "success") {
                // Set the list of songs if successful
                setListOfSongs(response["message"]["songs"]);

                // If there is a stars rating, fetch that
                if ("stars" in response["message"]) {
                    setRating(response["message"]["stars"])
                }

                // If there is a user comment, fetch that as well
                if ("comment" in response["message"]) {
                    setComment(response["message"]["comment"])
                }
            }
            else {
                // If the request was not successful, indicate an error
                setErrState(true);
            }
        });

        // Get the API token for the user
        SOCKET.emit("/api/get_api_token", {}, (response) => {
            setAuthToken(response["message"]);
        });
    }, []);

    // Render the componenet
    if (errState) {
        return (
            <h1>No playlist ID Provided</h1>
        )
    }

    // Define the rendering behavior for this component
    return (
        <div className="flex justify-center items-center w-full h-[calc(100vh-80px)]">
            <CassetteDisplay token={authToken} listOfSongs={listOfSongs} rating={rating} setRating={setRating} comment={comment} setComment={setComment} onSubmit={handleReviewSubmit}/>
            { /* <div style={{display: 'flex', flexDirection: 'column'}}>
        { /* Wait until the the player is logged in before rending the player  }
	    { ( authToken === '' ) ? <h1>Logging in</h1> : <SpotifyPlayer token={authToken} listOfSongs={listOfSongs}/> } */ }

            { /* <h1>Song Review</h1>
		<ReviewForm
		    rating={rating}
		    setRating={setRating}
		    comment={comment}
		    setComment={setComment}
		    onSubmit={handleReviewSubmit}
		/> */ }
        </div>
    );
}

// Export this component
export default PlayMusic;
