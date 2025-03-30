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

// Controlls the player when user pressed button button with player player
async function pressCassetteButton(button, player) {
    const buttonWait = 100; // Amount to wait before completing action

    // Play button press sound effect
    button_sfx.play();

    // Determins what happens when button is pressed
    if (button == 'playpause') {
	sleep(buttonWait).then(() => { player.togglePlay(); });
    } else if (button == 'rewind') {
	sleep(buttonWait).then(() => { player.previousTrack(); });
    } else if (button == 'fastforward') {
	sleep(buttonWait).then(() => { player.nextTrack(); });
    }
}

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
		  <img src={is_paused ? require("../boombox_assets/pp_pressed.png")
			    : require("../boombox_assets/pp_unpressed.png") }
		       style={{position: 'absolute', top: '0px', left: '0px', zIndex: '1'}}
		       alt="" />

		  <img src={require("../boombox_assets/rr_unpressed.png") }
		       style={{position: 'absolute', top: '0px', left: '0px', zIndex: '1'}}
		       alt="" />

		  <img src={require("../boombox_assets/ff_unpressed.png") }
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
