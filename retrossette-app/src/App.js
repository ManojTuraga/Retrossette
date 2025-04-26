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
    
Sources: React Documentation, Socketio Documentation, RetroUI Documentation
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
import TestThemes from './pages/TestThemes';
import GetRecommendation from './pages/GetRecommendation';
//import Boombox from './Boombox.js';

// Import all the required routing libraries from the react
// router dom
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

import { Button } from 'pixel-retroui'

/******************************************************************************
PROCEDURES
******************************************************************************/

/**
 * This function defines the rendering behavior of the app component
 */
function App() {
    // Define a state variable for socket connection state
    const [isConnected, setIsConnected] = useState(SOCKET.connected);
    const [profileName, setProfileName] = useState('');
    const [profileImage, setProfileImage] = useState('');

    // This is a local function that updates the
    // local storage when a playlist is selected
    function handlePlaylistSelected(id) {
        window.location.href = `/PlayMusic?id=${id}`;
    }

    // The is the side effect behavior for this component.
    // This side effect will initialize the connection behavior
    // for the socket
    useEffect(() => {
        // Local function for socket connection
        function onConnected() {
            setIsConnected(true);
        }

        // Local function for socket disconnection
        function onDisconnected() {
            setIsConnected(false);
        }

        // Set the function objects for the socket on
        // connection/disconnection
        SOCKET.on('connect', onConnected);
        SOCKET.on('disconnect', onDisconnected);

        return () => {
            SOCKET.off('connect', onConnected);
            SOCKET.off('disconnect', onDisconnected);
        }
    })

    // Get the profile information from the server
    SOCKET.emit("/api/get_profile_information", {}, (response) => {
        setProfileName(response["message"]["profile_name"]);
        setProfileImage(response["message"]["profile_image"]);
    })

    // This function will get a recommendation from the server
    // and redirect the user to the PlayMusic page with the
    // recommendation id
    function redirect_on_recommendation() {
        SOCKET.emit("/api/get_recommendation", {}, (response) => {
            window.location.href = `/PlayMusic?id=${response[ "message" ]}`;
        })
    }

    // Render the page to route each required componenet to it's
    // corresponding URL. Right now the only required componenets
    // are the CreatePlaylist page, the ViewPlaylists page, and the
    // PlayMusic page.

    //NOTE: THE TEST ROUTE SHOULD BE DELETED, THIS IS JUST A PROOF
    // OF CONCEPT
    return (
        <>
            <Router>
                <Button onClick={redirect_on_recommendation} className="fixed bottom-5 right-5 w-16 h-16 flex items-center justify-center text-2xl z-50" style={{ background: "linear-gradient(45deg, #FF82F9 5%, #FFCFFF 10%, #FFC2FD 30%, #FFA1FC 50%, #FFC2FD 70%, #FFCFFF 80%, #FF82F9 95%)", }} borderColor='#ffffff'>
                    ?
                </Button>
                <Routes>
                    <Route element={<Layout profileName={profileName} profileImage={profileImage} />}>
                        <Route path="" element={<HomePage />}></Route>
                        <Route path="/CreatePlaylist" element={<CreatePlaylist />}></Route>
                        <Route path="/ViewPlaylists" element={<ViewPlaylists handlePlaylistSelected={handlePlaylistSelected} />}></Route>
                        <Route path="/PlayMusic" element={<PlayMusic />}></Route>
                        <Route path="/TestThemes" element={<TestThemes />}></Route>
                        <Route path="/GetRecommendation" element={<GetRecommendation />}></Route>
                    </Route>
                </Routes>
            </Router>
        </>
    );
}

// Export just the App component
export default App