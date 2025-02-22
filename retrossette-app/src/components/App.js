import React, { useState, useEffect, ReactS } from 'react';
import { SOCKET } from './socket.js'

import CreatePlaylist from './CreatePlaylist.js';

import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

function App()
    {
    const [ isConnected, setIsConnected ] = useState( SOCKET.connected );

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
            <Router>
                <Routes>
                    <Route path="/CreatePlaylist" element={ <CreatePlaylist /> }></Route>
                </Routes>
            </Router>
    );
    }

export default App