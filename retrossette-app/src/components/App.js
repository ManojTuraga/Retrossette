import React, { useState, useEffect, ReactS } from 'react';
import { SOCKET } from './socket.js'

import Search from "./Search.js"


import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

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
        <div>
            <Search />
        </div>
    );
    }

export default App