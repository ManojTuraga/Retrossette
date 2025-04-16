import React, { useEffect, useState } from 'react';

import "../css/CassettePlayer.css"

import cassette from '../images/active.gif'


// Sleep for ms milliseconds
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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

// Sound effect for pressing a button on the cassette player
const button_sfx = new Audio('../boombox_assets/button_press_sfx.mp3')

// Gets the total length of the cassette from a list of songs in ms
function getTotalCassetteLength(songList) {
    let totalCassetteLength = 0;

    // Add each duration of each track
    if (songList.length > 0) {
	for (let track of songList) {
	    totalCassetteLength += track['duration_ms'];
	}
    }

    return totalCassetteLength;
}

// Get the absolute position in ms in a current cassette with list of songs
// songList playing current song current_song_uri, and the current position
// in ms in the current song
function getAbsolutePosition(songList, current_song_uri, current_position) {
    let pos = 0;

    for (let track of songList) {
	if (current_song_uri === track['uri'].slice(14)) {
	    // If the current track is the current song playing, add and
	    // return the current position
	    pos += current_position;
	    break;
	} else {
	    // Otherwise just add the length of the whole song
	    pos += track['duration_ms'];
	}
    }

    return pos;
}

// Given the current absolute position, return the current song and position
// in the list of songs songList
function getRelativePosition(songList, absolute_position, totalCassetteLength) {
    let current_song_uri = '';
    let current_position = 0;
    let pos = absolute_position;

    // Check if position is in bounds and just reset cassette if not
    if ((absolute_position <= 0) ||
	(absolute_position >= totalCassetteLength)) {
	return [songList[0]['uri'], 0];
    }

    // Go through songs until reach the current song from the absolute position
    for (let track of songList) {
	if (pos < track['duration_ms']) {
	    current_song_uri = track['uri'];
	    current_position = pos;
	    break;
	} else {
	    pos -= track['duration_ms'];
	}
    }

    return [current_song_uri.slice(14), current_position];
}

// Given a song URI in a song list songList get the index of the song in
// the list
function uriToTrackIndex(songList, uri) {
    for (const [index, track] of songList.entries()) {
	if (uri === track['uri'].slice(14)) {
	    return index;
	}
    }

    return 0;
}

// Debugging function for pretty print of time in ms
function printTime(time) {
    const ms = time % 1000;
    time = Math.floor(time / 1000);
    const seconds = time % 60;
    time = Math.floor(time / 60);
    const minutes = time  % 60;
    time = Math.floor(time / 60);
    const hours = time;

    return `${hours}:${minutes}:${seconds}:${ms}`;
}

export default function CassetteDisplay({ token, listOfSongs }) {
// Set state variable for controlling pause state
    const [is_paused, setPaused] = useState(false);

    // Set state variable for controlling is active state
    const [is_active, setActive] = useState(false);

    // Set state variable for controlling player state
    const [player, setPlayer] = useState(undefined);

    // Set state variable for controlling current track
    const [current_track, setTrack] = useState(track);

    // Set state variable for controlling device id
    const [deviceId, setDeviceId] = useState(null);

    // Set state variable for if the cassette is being rewound
    const [is_rewinding, setRewind] = useState(false);

    // Set state variable for if the cassette is being fastforwarderd
    const [is_fast_forwarding, setFastForward] = useState(false);

    // Set state variable surrounding time of rewinding and fastwoarding
    const [time_button_held, setTimeButtonHeld] = useState(0);

    // Set state variable for list of song information
    const [songList, setSongList] = useState([]);

    // Set state variable for total cassette length
    const [totalCassetteLength, setTotalCassetteLength] = useState(0);

    // Set state variable representing the offset of the current song
    // and also the position in that song
    const [offset, setOffset] = useState(0);
    const [relative_pos, setRelativePos] = useState(0);

    // Determines how fast rewind or fast forward is
    const speedupFactor = 4;

    // Controlls what happens when fast forwarding and rewinding is happening
    // and also changes the state of the player when finished
    useEffect(() => {
    // ID for timer to see how long the button is held for
    let intervalID;
    
    // If the cassette is currently rewinding or fast forwarding then
    // add a timer to see how long the button is held for
    if (is_rewinding || is_fast_forwarding) {
        if (is_rewinding) {
        setPaused(true);
        setFastForward(false);
        // Timer backwards for rewinding
        intervalID = setInterval(() => setTimeButtonHeld(time_button_held - 10), 10);
        } else if (is_fast_forwarding) {
        setPaused(true);
        setRewind(false);
        // Timer forward for fast forwarding
        intervalID = setInterval(() => setTimeButtonHeld(time_button_held + 10), 10);
        }
        
    // Triggered when just finished rewinding or fastforwarding. This handles the result
    // to make sure the player is updated properly
    } else if (!(is_rewinding && is_fast_forwarding) &&
           (time_button_held !== 0)) {
        console.log(`Button Held For: ${printTime(time_button_held)}`);

        let current_song_uri = '';
        let relative_pos = 0;

        // Get the current state before the button was held
        player.getCurrentState().then(state => {
        if (state) {
            // Get current relative position before the button was held
            current_song_uri = state['track_window']['current_track']['uri'].slice(14);
            relative_pos = state['position'];
            console.log(state);
        }

        console.log(relative_pos);

        // Get absolute position and index before the button was held
        let current_index = uriToTrackIndex(songList, current_song_uri);
        let pos = getAbsolutePosition(songList, current_song_uri, relative_pos);
        
        console.log(`Current relative pos: ${printTime(relative_pos)} at index ${current_index}`);
        console.log(`Absolute pos: ${printTime(pos)}`);

        // Calculate the new absolute position
        pos += time_button_held * speedupFactor;

        // Calculate new relative position
        let new_pos = getRelativePosition(songList, pos, totalCassetteLength);
        current_song_uri = new_pos[0];
        setRelativePos(new_pos[1]);

        // Calculate new index
        let new_index = uriToTrackIndex(songList, current_song_uri);
        setOffset(new_index);
        
        console.log(`New pos: ${printTime(relative_pos)} at index ${new_index}`)
        console.log(`New absolute pos: ${printTime(pos)}`);
        });

        // Reset timer
        setTimeButtonHeld(0);
    }

    return () => clearInterval(intervalID);
    }, [is_rewinding, is_fast_forwarding, time_button_held]);

    // API request to change the player state after a rewind or fast forward
    useEffect(() => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            uris: listOfSongs,
        offset: { position : offset }, 
        position_ms: relative_pos
        })
    }).then( response => {
        if (response.ok) {
        console.log('Rewind/FastForward Complete');
        } else {
        console.log(`Error with rewind/fast forward: ${response}`);
        }
    });
    }, [relative_pos]);

    // Controls the state when user pressed button button
    async function pressCassetteButton(button, player) {
    const buttonWait = 0; // Amount to wait before completing action
    
    // Play button press sound effect
    button_sfx.play();
    
    // Controls state based on what button was pressed
    if (button === 'playpause') {
        sleep(buttonWait).then(() => { player.togglePlay();
                       setRewind(false);
                       setFastForward(false); });
    } else if (button === 'rewind') {
        is_rewinding ? setRewind(false) : setRewind(true);
    } else if (button === 'fastforward') {
        is_fast_forwarding ? setFastForward(false) : setFastForward(true);
    }
    }

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log(token);

            // Initialize a spotify player
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(token); },
                volume: 0.5
            });

            // Set player as the active player
            setPlayer(player);
            
            // Add function for when the player is ready to being playing
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });

            // Add a function for when the player is not ready to begin playing
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Add a function to handle state changes in the player
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

            // Connect to the player
            player.connect();
        };
    }, [token, listOfSongs]);

    useEffect(() => {
        if (deviceId) {
            // Transfer playback to the Web Playback SDK player
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    device_ids: [deviceId],
                    play: true,
                    uris: listOfSongs
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

    useEffect(() => {
    let listOfSongURIs = [];

    for (let URI of listOfSongs) {
        listOfSongURIs.push(URI.slice(14));
    }
    
    fetch(`https://api.spotify.com/v1/tracks?ids=${listOfSongURIs.join(',')}`, {
            method: 'GET',
            headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
            }
    }).then(response => {
            if (response.ok) {
        return response.json();
        }
    }).then(json => {
        setSongList(json['tracks']);
    }).catch(err => {
        console.log(err);
    });
    }, [listOfSongs]);

    useEffect(() => {
    const cassetteLength = getTotalCassetteLength(songList);
    setTotalCassetteLength(cassetteLength);
    console.log(`Current Cassette Length: ${printTime(cassetteLength)}`);
    }, [songList]);  


 
    return (
        <div class="parent">
            <div class="div1"></div>
            <div class="div2">
                <div class="cassette-area">
                <div id="cassette-casing">
                    <div id="cassette-anim-spot">
                         <img src={cassette} alt="" className="w-5/6 h-5/6 relative place-self-center"/>  
                    </div>
                </div>
                </div>
            </div>
            <div class="div3">
                <div class="db-meter-flex-container">
                <div class="db-components-flex-container">
                    <div class="db-meter-area">
                    <div class="timer-container">
                        <div class="timer-grid">
                        <div id="timer-digit-1">0</div>
                        <div id="timer-digit-2">0</div>
                        <div id="timer-digit-3">0</div>
                        <div id="timer-digit-4">0</div>
                        </div>
                    </div>
                    <div class="timer-lights-container">
                        <div class="timer-lights-grid">
                        <div id="timer-green-light"></div>
                        <div id="timer-red-light"></div>
                        </div>
                    </div>
                    <div class="db-meter-1">
                        <div class="db-meter-outline"></div>
                    </div>
                    <div class="db-meter-2"></div>
                    </div>
                </div>
                </div>
            </div>
            <div class="div4">
                <div class="volume-area">
                <div class="volume-inner-area"> 
                    <div id="volume-text">Volume</div>
                    <div id="volume-knob">
                    <div id="volume-knob-circle">
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="div5"></div>
            <div class="div6">
                <div class="power-area">
                <div id="power-text">Power</div>
                <div id="power-button"></div>
                </div>
            </div>
            <div class="div7">
                <div class="play-buttons-flex-container">
                <div class="play-buttons-area">
                    <div class="rewind-area">
                    <div id="rewind-text">
                        Rewind
                    </div>
                    <div id="rewind-button" onClick={() => { pressCassetteButton('rewind', player); }}>
                        
                    </div>
                    </div>
                    <div class="fast-foward-area">
                    <div id="fast-foward-text">
                        FF
                    </div>
                    <div id="fast-foward-button" onClick={() => { pressCassetteButton('fastforward', player); }}></div>
                    </div>
                    <div class="play-area">
                    <div id="play-text">
                        Play
                    </div>
                    <div id="play-button"></div>
                    </div>
                    <div class="pause-area">
                    <div id="pause-text">
                        Pause
                    </div>
                    <div id="pause-button" onClick={() => { pressCassetteButton('playpause', player); }}></div>
                    </div>
                </div>
                </div>
            </div>
            <div class="div8">
                <div class="time-left-bar-container">
                <div id="time-left-bar">
                    <div id="time-left-inner-bar"></div>
                </div>
                </div>
            </div>
            <div class="div9">
                <div class="share-container">
                <div id="share-button">Share</div>
                </div>
            </div>
            <div class="div10">
                <div class="song-container">
                <div id="song-button">
                    
                </div>
                </div>
            </div>
            </div> 
    ); 
}