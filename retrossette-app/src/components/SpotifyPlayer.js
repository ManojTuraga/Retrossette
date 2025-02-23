import React, { useEffect, useState } from 'react';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

const SpotifyPlayer = ({ token, listOfSongs }) => {
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [player, setPlayer] = useState(undefined);
    const [current_track, setTrack] = useState(track);
    const [deviceId, setDeviceId] = useState(null);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log(token);
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.addListener('player_state_changed', (state => {
                if (!state) {
                    return;
                }

                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                player.getCurrentState().then(state => {
                    (!state) ? setActive(false) : setActive(true)
                });
            }));

            player.connect();
        };
    }, [token, listOfSongs]);

    useEffect(() => {
        if (deviceId) {
            // Transfer playback to the Web Playback SDK player
            fetch('https://api.spotify.com/v1/me/player', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    device_ids: [deviceId],
                    play: true
                })
            }).then(response => {
                if (response.ok) {
                    console.log('Playback transferred successfully');
                } else {
                    console.error('Failed to transfer playback');
                }
            });
        }
    }, [deviceId, token, listOfSongs]);

    const playTracks = (trackUris) => {
        console.log( trackUris );
        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                uris: trackUris,
                offset: {
                    position: 0
                }
            })
        }).then(response => {
            if (response.ok) {
                console.log('Playback started successfully');
            } else {
                console.error('Failed to start playback');
            }
        });
    };

    if (!is_active) {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">
                        <b> Instance not active. Transfer your playback using your Spotify app </b>
                    </div>
                </div>
            </>
        );
    } else {
        return (
            <>
                <div className="container">
                    <div className="main-wrapper">

                        <img src={current_track.album.images[0].url} className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{current_track.name}</div>
                            <div className="now-playing__artist">{current_track.artists[0].name}</div>

                            <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                                &lt;&lt;
                            </button>

                            <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                                {is_paused ? "PLAY" : "PAUSE"}
                            </button>

                            <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                                &gt;&gt;
                            </button>
                            
                            <button className="btn-spotify" onClick={() => playTracks(listOfSongs)} >
                                Play Tracks
                            </button>

                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default SpotifyPlayer;
