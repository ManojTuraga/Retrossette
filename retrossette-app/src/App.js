/******************************************************************************
Module: app.js
Creation Date: February 20th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga, Connor Forristal, Ceres Botkin

Description:
    This file defines the behavior for the App component of the retrossette
    application. While the index.js defines the rendering behavior, this file
    will define the initial retrossette specific components that are defined
    throughout the page.

Inputs:
    None

Outputs:
    Web Page

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

/******************************************************************************
IMPORTS
******************************************************************************/
// From the react library, import the React framework and the
// useState and useEffect functions
import React, { useState, useEffect } from 'react';

// Import the SOCKET that is location in the socket.js component
import { SOCKET } from './components/socket'

// Import the retrossette specific components
import CreatePlaylist from './pages/CreatePlaylist';
import ViewPlaylists from './pages/ViewPlaylists';
import PlayMusic from './pages/PlayMusic';
import HomePage from './pages/HomePage'
import Layout from './Layout'
//import Boombox from './Boombox.js';

// Import all the required routing libraries from the react
// router dom
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

/******************************************************************************
PROCEDURES
******************************************************************************/

/**
 * This function defines the rendering behavior of the app component
 */
function App()
    {
    // Define a state variable for socket connection state
    const [ isConnected, setIsConnected ] = useState( SOCKET.connected );

    // This is a local function that updates the
    // local storage when a playlist is selected
    function handlePlaylistSelected( id )
        {
        localStorage.setItem( 'playlist_id', id );
        window.location.href = "/PlayMusic";
        }

    // The is the side effect behavior for this component.
    // This side effect will initialize the connection behavior
    // for the socket
    useEffect( () => 
        {
        // Local function for socket connection
        function onConnected()
            {
            setIsConnected( true );
            }

        // Local function for socket disconnection
        function onDisconnected()
            {
            setIsConnected( false );
            }
        
        // Set the function objects for the socket on
        // connection/disconnection
        SOCKET.on( 'connect', onConnected );
        SOCKET.on( 'disconnect', onDisconnected );
        
        return () =>
            {
            SOCKET.off( 'connect', onConnected );
            SOCKET.off( 'disconnect', onDisconnected );
            }
        } )
    
    // Render the page to route each required componenet to it's
    // corresponding URL. Right now the only required componenets
    // are the CreatePlaylist page, the ViewPlaylists page, and the
    // PlayMusic page.
    return (
            <Router>
                <Routes>
                    <Route element={ <Layout/> }>
                        <Route path="" element={ <HomePage/> }></Route>
                        <Route path="/CreatePlaylist" element={ <CreatePlaylist/> }></Route>
                        <Route path="/ViewPlaylists" element={ <ViewPlaylists handlePlaylistSelected={ handlePlaylistSelected }/> }></Route>
                        <Route path="/PlayMusic" element={ <PlayMusic/> }></Route>
                        </Route>
                </Routes>
            </Router>
            // <>
            // <Boombox/>
            // </>
        );
    }

// Export just the App component
export default App