import React, { useEffect, useState } from 'react';
import SpotifyPlayer from './SpotifyPlayer';
import { SOCKET } from './socket';

function PlayMusic() {
    const [listOfSongs, setListOfSongs] = useState([]);
    const [authToken, setAuthToken] = useState('');


    useEffect(() => {
            let playlistID = Number(localStorage.getItem('playlist_id')) || 0;
            SOCKET.emit("/api/get_songs_from_playlist", { message: playlistID }, (response) => {
                setListOfSongs(response["message"]);
            });
    
            SOCKET.emit("/api/get_api_token", {}, (response) => {
                setAuthToken(response["message"]);
            });
        }, []);

    return (
        <>
        { ( authToken === '' ) ? <h1>Logging in</h1> : <SpotifyPlayer token={authToken} listOfSongs={listOfSongs}/> }
        </>
    );
}

export default PlayMusic;
