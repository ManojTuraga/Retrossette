/******************************************************************************
Module: PlayMusic.js
Creation Date: February 18th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga, Ceres Botkin

Description:
    This page creates the logic for the web player boombox

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

/*
NOTE: THIS CODE IS CURRENTLY FOLLOWING THE EXAMPLE CREATED AT
https://github.com/spotify/spotify-web-playback-sdk-example

ALL THE DOCUMENTATION FOR THIS CODE CAN BE FOUND THERE AS
THIS IS THEIR CREATION. ONCE WE CREATE AN IMPLEMENTATION
OF OUR OWN WEBPLAYER, THEN WE WILL PROVIDE OUR OWN DOCUMENTATION
*/

import React, { useEffect, useState } from 'react';

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

/*
// Controlls the player when user pressed button button with player player
async function pressCassetteButton(button, player) {
    //const buttonWait = 100; // Amount to wait before completing action

    // Play button press sound effect
    button_sfx.play();

    // Determins what happens when button is pressed
    if (button == 'playpause') {
	sleep(buttonWait).then(() => { player.togglePlay(); });
    } else if (button == 'rewind') {
	sleep(buttonWait).then(() => { skipCassetteButton('rewind', player); });
    } else if (button == 'fastforward') {
	sleep(buttonWait).then(() => { skipCassetteButton('fastforward', player); });
    }
    } */

function getTotalCassetteLength(songList) {
    let totalCassetteLength = 0;
	
    if (songList.length > 0) {
	for (let track of songList) {
	    totalCassetteLength += track['duration_ms'];
	}
    }

    return totalCassetteLength;
}

function getAbsolutePosition(songList, current_song_uri, current_position) {
    let pos = 0;

    for (let track of songList) {
	if (current_song_uri === track['uri'].slice(14)) {
	    pos += current_position;
	    break;
	} else {
	    pos += track['duration_ms'];
	}
    }

    return pos;
}

function getRelativePosition(songList, absolute_position, totalCassetteLength) {
    let current_song_uri = '';
    let current_position = 0;
    let pos = absolute_position;

    if ((absolute_position <= 0) ||
	(absolute_position >= totalCassetteLength)) {
	return [songList[0]['uri'], 0];
    }

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

function uriToTrackIndex(songList, uri) {
    for (const [index, track] of songList.entries()) {
	if (uri === track['uri'].slice(14)) {
	    return index;
	}
    }

    return 0;
}

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

/*
function changeToNewTrack(player, offset, relative_pos) {
    if (offset === 0) {
	return player.pause().then(player.seek(relative_pos));
    } else if (offset > 0) {
	return player.nextTrack().then(() => {
	    changeToNewTrack(player, offset - 1, relative_pos);
	});
    } else {
	return player.previousTrack().then(() => {
	    changeToNewTrack(player, offset + 1, relative_pos);
	});
    }
}
*/
    
const SpotifyPlayer = ({ token, listOfSongs }) => {
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

    const [offset, setOffset] = useState(0);
    const [relative_pos, setRelativePos] = useState(0);

    // Set state variable for current state of song
    //const [current_absolute_position, setAbsolutePosition] = useState(0);
    //let totalCassetteLength = 0;
    const speedupFactor = 10;

    useEffect(() => {
	let intervalID;
	if (is_rewinding || is_fast_forwarding) {
	    if (is_rewinding) {
		setPaused(true);
		setFastForward(false);
		intervalID = setInterval(() => setTimeButtonHeld(time_button_held - 10), 10);
	    } else if (is_fast_forwarding) {
		setPaused(true);
		setRewind(false);
		intervalID = setInterval(() => setTimeButtonHeld(time_button_held + 10), 10);
	    }
	} else if (!(is_rewinding && is_fast_forwarding) &&
		   (time_button_held !== 0)) {
	    console.log(`Button Held For: ${printTime(time_button_held)}`);

	    let current_song_uri = '';
	    let relative_pos = 0;

	    player.getCurrentState().then(state => {
		if (state) {
		    current_song_uri = state['track_window']['current_track']['uri'].slice(14);
		    relative_pos = state['position'];
		    console.log(state);
		}

		console.log(relative_pos);
		
		let current_index = uriToTrackIndex(songList, current_song_uri);
		let pos = getAbsolutePosition(songList, current_song_uri, relative_pos);
		
		console.log(`Current relative pos: ${printTime(relative_pos)} at index ${current_index}`);
		console.log(`Absolute pos: ${printTime(pos)}`);
		
		pos += time_button_held * speedupFactor;
		
		let new_pos = getRelativePosition(songList, pos, totalCassetteLength);
		current_song_uri = new_pos[0];
		setRelativePos(new_pos[1]);
		let new_index = uriToTrackIndex(songList, current_song_uri);
		//setOffset(new_index - current_index);
		setOffset(new_index);
		
		console.log(`New pos: ${printTime(relative_pos)} at index ${new_index}`)
		console.log(`New absolute pos: ${printTime(pos)}`);
	    });
	    
	    setTimeButtonHeld(0);
	}

	return () => clearInterval(intervalID);
    }, [is_rewinding, is_fast_forwarding, time_button_held]);

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

    // Controlls the player when user pressed button button with player player
    async function pressCassetteButton(button, player) {
	const buttonWait = 0; // Amount to wait before completing action
	
	// Play button press sound effect
	button_sfx.play();
	
	// Determins what happens when button is pressed
	if (button === 'playpause') {
	    sleep(buttonWait).then(() => { player.togglePlay();
					   setRewind(false);
					   setFastForward(false); });
	} else if (button === 'rewind') {
	    //sleep(buttonWait).then(() => { skipCassetteButton('rewind', player); });
	    is_rewinding ? setRewind(false) : setRewind(true);
	} else if (button === 'fastforward') {
	    //sleep(buttonWait).then(() => { skipCassetteButton('fastforward', player); });
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

    // Define the rendering player for this componenet
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
            <div className="container">
              <div className="main-wrapper">
		  
                  <img src={require("../boombox_assets/player.png")}
		       style={{position: 'absolute', top: '0px', left: '0px', zIndex: '2'}}
		       alt="" />
		  <img src={!(is_paused || is_rewinding || is_fast_forwarding)
			    ? require("../boombox_assets/pp_pressed.png")
			    : require("../boombox_assets/pp_unpressed.png") }
		       style={{position: 'absolute', top: '0px', left: '0px', zIndex: '1'}}
		       alt="" />

		  <img src={is_rewinding ? require("../boombox_assets/rr_pressed.png")
			    : require("../boombox_assets/rr_unpressed.png") }
		       style={{position: 'absolute', top: '0px', left: '0px', zIndex: '1'}}
		       alt="" />

		  <img src={is_fast_forwarding ? require("../boombox_assets/ff_pressed.png")
			    : require("../boombox_assets/ff_unpressed.png") }
		       style={{position: 'absolute', top: '0px', left: '0px', zIndex: '1'}}
		       alt="" />

		  <button style={{position: 'absolute', top: '58px', left: '476px', zIndex: '10',
				  width: '84px', height: '56px'}}
			  onClick={() => { pressCassetteButton('playpause', player); }}>
		  </button>

		  <button style={{position: 'absolute', top: '58px', left: '375px', zIndex: '10',
				  width: '84px', height: '56px'}}
			  onClick={() => { pressCassetteButton('rewind', player); }}>
		  </button>

		  <button style={{position: 'absolute', top: '58px', left: '577px', zIndex: '10',
				  width: '84px', height: '56px'}}
			  onClick={() => { pressCassetteButton('fastforward', player); }}>
		  </button>

		  {/*
                  <div className="now-playing__side">
                      <div className="now-playing__name">{current_track.name}</div>
                      <div className="now-playing__artist">{current_track.artists[0].name}</div>
                  </div>
		   */}
	      </div>
          </div>
        );
    }
}

export default SpotifyPlayer;
