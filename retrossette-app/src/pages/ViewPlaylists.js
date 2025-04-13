/******************************************************************************
Module: ViewPlaylists.js
Creation Date: February 18th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga

Description:
    This module shows all the playlists that are currently in the database

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
    
Sources: React Documentation, Socketio Documentation, Retroui documentation
******************************************************************************/

/*******************************************************************************
IMPORTS
*******************************************************************************/
// From the react framework import the react component
// and the use state function
import React, { useState } from 'react';

// Import the SOCKET from the socket component
import { SOCKET } from '../components/socket';

// Import the cassette 8 bit gif 
// Source https://www.deviantart.com/wavegazer/art/80-s-Tape-Rainbow-543222626
import static_img from '../images/static.png'
import active_img from '../images/active.gif'

// Import the button and the popup from retroui
import { Button, Popup } from 'pixel-retroui';

/*******************************************************************************
PROCEDURES
*******************************************************************************/
/*
* This function is a temporary component that allows the 
* user to see all the playlists that are currently created
*/
function ViewPlaylists( { handlePlaylistSelected } )
    {
    // Create a state variable to store the list of playlists
    const [ listOfPlaylists, setListOfPlaylists ] = useState([]);

    // Create a state variable for if the popup is open
    const [ isPopupOpen, setIsPopupOpen ] = useState( false );

    // Create a state variable for the name of the playlist
    const [ selectedName, setSelectedName ] = useState( "" );

    // Create a state variable for the id of the playlist
    const [ selectedId, setSelectedId ] = useState( 0 );

    // Request a list of playlists from the server
    SOCKET.emit( "/api/get_playlists", {}, ( response ) => setListOfPlaylists( response[ "message" ] ) )

    // Define a a local function that will define the behavior of
    // opening the popup
    function handlePopupOpen( name, playlist_id )
        {
        // Declare the that the popup should be opened
        setIsPopupOpen( true );

        // Set the name of the selected playlist
        setSelectedName( name );

        // Set the ID of the selected playlist
        setSelectedId( playlist_id )
        }
    
    // Render teh componenet
    return(
        <div>
        <div className="grid grid-cols-1 mx-12 pt-4">
            <div className="h-full grid gap-4 items-center 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
                {
                // Map every playlist to a clickable element that when clicked opens a popup
                listOfPlaylists.map((playlist) => (
                    <div  
                        className="h-auto text-white aspect-square flex items-center justify-center">
                        {/* Overlay text */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img className="absolute opacity-0 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105 origin-center" src={active_img} alt="GIF" onClick={() => handlePopupOpen( playlist.name, playlist.id )} />
                            <img className="opacity-100 hover:opacity-0 transition-opacity duration-300" src={static_img} alt="Static" />
                        </div>
                    </div>

                ))
                }
            </div> 
        </div>
        {/* Define a popup that when opened will show the playlist name and a button to be able to play the music */}
        <Popup
            isOpen={isPopupOpen}
            onClose={()=>setIsPopupOpen( false )}
            className='text-center'
        >
            <h1>Cassette Name: { selectedName }</h1>
            <Button onClick={()=>handlePlaylistSelected( selectedId )}>Play Cassette</Button>
        </Popup>
        </div>
    )
    }

// Export the componenet
export default ViewPlaylists;