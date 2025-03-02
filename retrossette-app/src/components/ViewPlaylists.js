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
import { SOCKET } from './socket';

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
        <ul>
            {
            listOfPlaylists.map( ( playlist ) =>(
                <li onClick={ () => handlePlaylistSelected( playlist[ "id" ] ) }>{ playlist[ "name" ] }, {playlist[ "id" ]}</li>
            ) )
            }
        </ul>
    )
    }

// Export the componenet
export default ViewPlaylists;