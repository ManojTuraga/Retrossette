import React, { useState, useEffect } from 'react';
import { SOCKET } from './socket.js'

import CreatePlaylist from './CreatePlaylist.js';
import ViewPlaylists from './ViewPlaylists.js';
import PlayMusic from './PlayMusic.js';
import Boombox from './Boombox.js';

import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function App()
    {
    const [ isConnected, setIsConnected ] = useState( SOCKET.connected );
    const [ playlistSelected, setPlaylistSelected ] = useState(0);

    function handlePlaylistSelected( id )
        {
        localStorage.setItem( 'playlist_id', id );
        window.location.href = "/PlayMusic";
        }

    useEffect( () => 
        {
        function onConnected()
            {
            setIsConnected( true );
            }
        function onDisconnected()
            {
            setIsConnected( false );
            }

        SOCKET.on( 'connect', onConnected );
        SOCKET.on( 'disconnect', onDisconnected );
        
        return () =>
            {
            SOCKET.off( 'connect', onConnected );
            SOCKET.off( 'disconnect', onDisconnected );
            }
        } )

    return (
            // <Router>
            //     <Routes>
            //         <Route path="/CreatePlaylist" element={ <CreatePlaylist /> }></Route>
            //         <Route path="/ViewPlaylists" element={ <ViewPlaylists handlePlaylistSelected={ handlePlaylistSelected }/> }></Route>
            //         <Route path="/PlayMusic" element={ <PlayMusic/> }></Route>
            //     </Routes>
            // </Router>
            <>
            <Boombox/>
            </>
    );
    }

export default App