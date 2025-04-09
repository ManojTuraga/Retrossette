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
    
Sources: React Documentation, Socketio Documentation
******************************************************************************/

/*******************************************************************************
IMPORTS
*******************************************************************************/
// From the react framework import the react component
// and the use state function
import React, { useState } from 'react';

// Import the SOCKET from the socket component
import { SOCKET } from '../components/socket';

import static_img from '../images/static.png'
import active_img from '../images/active.gif'

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

    // Request a list of playlists from the server
    SOCKET.emit( "/api/get_playlists", {}, ( response ) => setListOfPlaylists( response[ "message" ] ) )
    
    // Render teh componenet
    return(
        /*<ul>
            {
            listOfPlaylists.map( ( playlist ) =>(
                <li onClick={ () => handlePlaylistSelected( playlist[ "id" ] ) }>{ playlist[ "name" ] }, {playlist[ "id" ]}</li>
            ) )
            }
        </ul>*/

        <div className="grid grid-cols-1 mx-12 pt-4">
            <div className="h-full grid gap-4 items-center 2xl:grid-cols-6 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
                {
                listOfPlaylists.map((playlist) => (
                    <div  
                        className="h-auto text-white aspect-square flex items-center justify-center">
                        {/* Overlay text */}
                        <div className="relative w-full h-full flex items-center justify-center">
                            <img className="absolute opacity-0 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105 origin-center" src={active_img} alt="GIF" onClick={() => handlePlaylistSelected(playlist["id"])} />
                            <img className="opacity-100 hover:opacity-0 transition-opacity duration-300" src={static_img} alt="Static" />
                        </div>
                    </div>

                ))
                }
            </div>
        </div>

    )
    }

// Export the componenet
export default ViewPlaylists;