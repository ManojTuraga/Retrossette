/******************************************************************************
Module: genreBox.js
Creation Date: April 2nd, 2025
Authors: Connor Forristal
Contributors: Connor Forristal, Manoj Turaga

Description:
    This module defines the behavior of the genre specific cassettes that show
    up on the home page

Inputs:
    The name of the genre and the playlists associated with it

Outputs:
    Genre Box componenet

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
    
Sources: React Documentation, Socketio Documentation, Pixel Retroui documentation
******************************************************************************/
// Import the React frame work and the useState function
import React, { useState } from 'react';

// Import the cassette 8 bit gif 
// Source https://www.deviantart.com/wavegazer/art/80-s-Tape-Rainbow-543222626
import static_img from '../images/static.png'
import active_img from '../images/active.gif'

// Import the card, popup, and button components from the retroui library
import { Card, Popup, Button } from 'pixel-retroui'
/******************************************************************************
PROCEDURES
******************************************************************************/

/* This function defines the rendering behavior of the GenreBox */
export default function GenreBox({ Genre, CassetteNames }) {
    // This function deifnes the behavior for when an image is clicked
    // on the page
    function handlePlaylistSelected(name, id) {
        // Indicate that the popup should be opened
        setIsPopupOpen(true);

        // Set the name of the playlist 
        setSelectedName(name);

        // Set the ID of the playlist
        setSelectedID(id)
    }

    // Define a state variable for when the playlist is open
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Define a state variable for the name of the playlist
    const [selectedName, setSelectedName] = useState("");

    // Define a state variable for the id of the playlist
    const [selectedID, setSelectedID] = useState(0);

    // Define the rendering behavior of this componenet
    return (
        <>
            { /* Make the card a grid that automatically handles overflow */}
            <Card className="col-span-1 overflow-y-auto scrollbar-hide p-4 h-[60vh]" 
            style={{ background: "linear-gradient(45deg, #999 5%, #fff 10%, #ccc 30%, #ddd 50%, #ccc 70%, #fff 80%, #999 95%)" }} borderColor='#ffffff'>
                { /* Create a div inside the card to allow for padding */}
                <div className="grid sm:grid-cols-1 md:grid-cols-2 content-start gap-4">
                    { /* Output the genre name */}
                    <div className="col-span-full text-2xl">{Genre}</div>
                    {
                        /* Create a clickable element that allows users to play music */
                        CassetteNames.map((playlist) => (
                            <div className="h-auto text-white aspect-square">

                                <div className="relative w-full h-full flex items-center justify-center">
                                    <img onClick={() => handlePlaylistSelected(playlist["name"], playlist["id"])} className="absolute opacity-0 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105 origin-center" src={active_img} alt="GIF" />
                                    <img className="opacity-100 hover:opacity-0 transition-opacity duration-300" src={static_img} alt="Static" />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </Card>
            { /* Create a popup that is triggered when a clickable element on the page is clicked
                 , showing the name of the cassette and allows the user to redirect to it */ }
            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                className='text-center'
            >
                <h1>Cassette Name: {selectedName}</h1>
                <Button onClick={() => { window.location.href = `/PlayMusic?id=${selectedID}`; }}>Play Cassette</Button>
            </Popup>
        </>
    );
}



