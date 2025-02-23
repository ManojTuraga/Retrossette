import React, { useState } from 'react';
import { SOCKET } from './socket';

function ViewPlaylists( { handlePlaylistSelected } )
    {
    const [ listOfPlaylists, setListOfPlaylists ] = useState([]);

    SOCKET.emit( "/api/get_playlists", {}, ( response ) => setListOfPlaylists( response[ "message" ] ) )
    
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
export default ViewPlaylists;