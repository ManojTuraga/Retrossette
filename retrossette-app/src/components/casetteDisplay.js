import React, { useEffect, useState, useRef } from 'react';

import "../css/CassettePlayer.css"

import cassette from '../images/active.gif'

import { Card, ProgressBar, Button, Popup, TextArea } from 'pixel-retroui'

// Import the cassette buttons
import { FaPlay, FaPause, FaFastForward, FaFastBackward } from "react-icons/fa";


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
function getAbsolutePosition(track_window, current_position) {
    let pos = 0;

    for (let track of track_window["previous_tracks"]) {
        pos += track['duration_ms'];
    }

    pos += current_position;
    return pos;
}

// Given the current absolute position, return the current song and position
// in the list of songs songList
function getRelativePosition(songList, absolute_position, totalCassetteLength) {
    let current_song_uri = '';
    let current_position = 0;
    let pos = absolute_position;
    let song_index = 0;

    // Check if position is in bounds and just reset cassette if not
    if ((absolute_position <= 0) ||
        (absolute_position >= totalCassetteLength)) {
        return [0, songList[0]['uri'], 0];
    }

    // Go through songs until reach the current song from the absolute position
    for (let i = 0; i < songList.length; i++) {
        if (pos < songList[i]['duration_ms']) {
            current_song_uri = songList[i]['uri'];
            current_position = pos;
            song_index = i
            break;
        } else {
            pos -= songList[i]['duration_ms'];
        }
    }

    return [song_index, current_song_uri.slice(14), current_position];
}

// Given a song URI in a song list songList get the index of the song in
// the list
function uriToTrackIndex(track_window) {
    return track_window["previous_tracks"].length
}

// Debugging function for pretty print of time in ms
function printTime(time) {
    const ms = time % 1000;
    time = Math.floor(time / 1000);
    const seconds = time % 60;
    time = Math.floor(time / 60);
    const minutes = time % 60;
    time = Math.floor(time / 60);
    const hours = time;

    return `${hours}:${minutes}:${seconds}:${ms}`;
}

export default function CassetteDisplay({ token, listOfSongs, rating, setRating, comment, setComment, onSubmit }) {
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

    const [rotation, setRotation] = useState(180);
    const circleRef = useRef(null);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [powerOn, setPowerOn] = useState(false);

    const [volume, setVolume] = useState(0.5);

    const [progress, setProgress] = useState(0); // Progress as a percentage

    const getAngle = (x, y) => {
        const rect = circleRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;

        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Convert radians to degrees
        return angle;
    };

    const handleMouseDown = (e) => {
        const initialAngle = getAngle(e.clientX, e.clientY);
        circleRef.current.dataset.initialAngle = initialAngle; // Store the initial angle
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const initialAngle = parseFloat(circleRef.current.dataset.initialAngle);
        const currentAngle = getAngle(e.clientX, e.clientY);
        let deltaAngle = currentAngle - initialAngle;

        // Ensure continuity in rotation:
        if (deltaAngle > 180) deltaAngle -= 360; // Adjust for clockwise wraparound
        if (deltaAngle < -180) deltaAngle += 360; // Adjust for counterclockwise wraparound

        setRotation((prevRotation) => {
            let newRotation = prevRotation + deltaAngle;

            // Prevent rotation from exceeding 360 degrees or dropping below 0
            if (newRotation >= 360) newRotation = 360;
            if (newRotation <= 0) newRotation = 0;

            setVolume(newRotation / 360);

            return newRotation;
        });

        circleRef.current.dataset.initialAngle = currentAngle; // Update the initial angle
    };


    const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        circleRef.current.dataset.initialAngle = null; // Reset initial angle
    };


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
            let curr_track_window = [];

            // Get the current state before the button was held
            player.getCurrentState().then(state => {
                if (state) {
                    // Get current relative position before the button was held
                    current_song_uri = state['track_window']['current_track']['uri'].slice(14);
                    relative_pos = state['position'];
                    console.log(state);
                    curr_track_window = state["track_window"]
                }

                console.log(relative_pos);

                // Get absolute position and index before the button was held
                let current_index = uriToTrackIndex(curr_track_window, current_song_uri);
                let pos = getAbsolutePosition(curr_track_window, relative_pos);

                console.log(`Current relative pos: ${printTime(relative_pos)} at index ${current_index}`);
                console.log(`Absolute pos: ${printTime(pos)}`);

                // Calculate the new absolute position
                pos += time_button_held * speedupFactor;

                // Calculate new relative position
                let new_pos = getRelativePosition(songList, pos, totalCassetteLength);
                current_song_uri = new_pos[1];
                setRelativePos(new_pos[2]);

                // Calculate new index
                let new_index = new_pos[0];
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
                offset: { position: offset },
                position_ms: relative_pos
            })
        }).then(response => {
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
        if (button === 'play' && is_paused) {

            sleep(buttonWait).then(() => {
                player.togglePlay();
                setRewind(false);
                setFastForward(false);
                setPaused(!is_paused);
            });
        }
        else if (button === 'pause' && !is_paused) {
            sleep(buttonWait).then(() => {
                player.togglePlay();
                setRewind(false);
                setFastForward(false);
                setPaused(is_paused);
            });
        } else if (button === 'rewind') {
            sleep(buttonWait).then(() => {
                if (!is_paused) {
                    player.togglePlay();
                }
                setRewind(!is_rewinding);
                setFastForward(false);
                setPaused(true);
            });

        } else if (button === 'fastforward') {
            sleep(buttonWait).then(() => {
                if (!is_paused) {
                    player.togglePlay();
                }
                setRewind(false);
                setFastForward(!is_fast_forwarding);
                setPaused(true);
            });
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
                volume: volume
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
                    setActive(true);
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
            console.log("Here");
            if (response.ok) {
                return response.json();
            }
        }).then(json => {
            setSongList(json['tracks']);
            console.log(json['tracks']);
        }).catch(err => {
            console.log(err);
        });
    }, [listOfSongs]);

    useEffect(() => {
        const cassetteLength = getTotalCassetteLength(songList);
        setTotalCassetteLength(cassetteLength);
        console.log(`Current Cassette Length: ${printTime(cassetteLength)}`);
    }, [songList]);

    useEffect(() => {
        if (player) {
            player.setVolume(volume).then(() => {
                console.log(volume);
            })
        }
    }, [volume])

    useEffect(() => {
        let interval;

        const updateProgress = async () => {
            const state = await player.getCurrentState();
            if (state) {
                const progressPercentage = (getAbsolutePosition(state["track_window"], state['position']) / totalCassetteLength) * 100;
                setProgress(progressPercentage);
            }
        };

        // Start updating progress every 500ms
        interval = setInterval(updateProgress, 500);

        return () => {
            // Clean up the timer when the component unmounts
            clearInterval(interval);
        };
    }, [player, totalCassetteLength]);

    function Timer(is_min, n, milliseconds) {
        const minutes = Math.floor(milliseconds / 60000).toString().padStart(2, '0');
        const seconds = ((milliseconds % 60000) / 1000).toFixed(0).toString().padStart(2, '0');

        if (is_min) {
            return minutes[n]
        }
        else {
            return seconds[n]
        }
    }

    function Meter({ id, isPaused }) {
        const meterRef = useRef(null);
        const needleRef = useRef(null);
    
        useEffect(() => {
            console.log("isPaused changed:", isPaused);
            function scaleNeedle() {
                if (!meterRef.current || !needleRef.current) return;
    
                const meterHeight = meterRef.current.offsetHeight;
                const needleHeight = meterHeight / 1.2;
    
                needleRef.current.style.height = `${needleHeight}px`;
                needleRef.current.style.top = `calc(50% - ${needleHeight / 2}px)`;
            }
    
            function animateNeedle() {
                if (!needleRef.current || isPaused) return; // Stop animation when paused
                const randomDegree = Math.random() * 180 - 90;
                needleRef.current.style.transform = `rotate(${randomDegree}deg)`;
            }
    
            scaleNeedle();
            window.addEventListener('resize', scaleNeedle);
    
            // Start animation only if music is playing
            let interval;
            if (!isPaused) {
                interval = setInterval(animateNeedle, 2000);
            }
    
            return () => {
                window.removeEventListener('resize', scaleNeedle);
                clearInterval(interval);
            };
        }, [isPaused]); // Ensure effect updates when music state changes
    
        return (
            <div ref={meterRef} className="meter-container">
                <div ref={needleRef} className="needle"></div>
            </div>
        );
    }

    return (
        <Card className="parent">
            <div class="div1"></div>
            <div class="div2">
                <div class="cassette-area">
                    <Card id="cassette-casing" className="bg-transparent">
                        <div id="cassette-anim-spot">
                            <img src={cassette} alt="" className="w-5/6 h-5/6 relative place-self-center" />
                        </div>
                    </Card>
                </div>
            </div>
            <div class="div3">
                <div class="db-meter-flex-container">
                    <Card className="db-components-flex-container bg-transparent">
                        <div class="db-meter-area">
                            <div class="timer-container">
                                <div class="timer-grid">
                                    <div id="timer-digit-1">{Timer(true, 0, progress * totalCassetteLength / 100)}</div>
                                    <div id="timer-digit-2">{Timer(true, 1, progress * totalCassetteLength / 100)}</div>
                                    <div id="timer-digit-3">{Timer(false, 0, progress * totalCassetteLength / 100)}</div>
                                    <div id="timer-digit-4">{Timer(false, 1, progress * totalCassetteLength / 100)}</div>
                                </div>
                            </div>
                            <div class="timer-lights-container">
                                <div class="timer-lights-grid">
                                    <div id="timer-green-light"></div>
                                    <div id="timer-red-light"></div>
                                </div>
                            </div>
                            <div class="db-meter-1">
                                <Meter id="meter1" isPaused={is_paused} />

                            </div>
                            <div class="db-meter-2">
                                <Meter id="meter2" isPaused={is_paused} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <div class="div4">
                <div class="volume-area">
                    <div class="volume-inner-area">
                        <div id="volume-text">Volume</div>
                        <div id="volume-knob">
                            <div id="volume-knob-circle" ref={circleRef} onMouseDown={handleMouseDown} style={{ transform: `rotate(${rotation}deg)` }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="div5"></div>
            <div class="div6">
                <div class="power-area">
                    <div id="power-text">Power</div>
                    <Card id="power-button" bg={is_active ? '#E4080A' : ''}></Card>
                </div>
            </div>
            <div class="div7">
                <div class="play-buttons-flex-container">
                    <div class="play-buttons-area">
                        <div class="rewind-area">
                            <div id="rewind-text">
                                Rewind
                            </div>
                            <Button className="flex items-center justify-center" id="rewind-button" bg={is_rewinding ? '#c6005c' : ''} onClick={() => { pressCassetteButton('rewind', player); }}><FaFastBackward className='className="mr-2 text-4xl' /></Button>
                        </div>
                        <div class="fast-foward-area">
                            <div id="fast-foward-text">
                                FF
                            </div>
                            <Button className="flex items-center justify-center" id="fast-foward-button" bg={is_fast_forwarding ? '#c6005c' : ''} onClick={() => { pressCassetteButton('fastforward', player); }}><FaFastForward className='className="mr-2 text-4xl' /></Button>
                        </div>
                        <div class="play-area">
                            <div id="play-text">
                                Play
                            </div>
                            <Button className="flex items-center justify-center" id="play-button" bg={is_paused ? '' : '#00BCD4'} onClick={() => { pressCassetteButton('play', player); }}><FaPlay className='className="mr-2 text-4xl' /></Button>
                        </div>
                        <div class="pause-area">
                            <div id="pause-text">
                                Pause
                            </div>
                            <Button className="flex items-center justify-center" id="pause-button" bg={is_paused ? '#00BCD4' : ''} onClick={() => { pressCassetteButton('pause', player); }}><FaPause className='mr-2 text-4xl' /></Button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="div8">
                <div class="time-left-bar-container">
                    <ProgressBar className='bg-transparent' progress={progress}></ProgressBar>
                </div>
            </div>
            <div class="div9">
                <div class="share-container">
                    <Button id="share-button" onClick={() => setIsPopupOpen(true)}>Share</Button>
                </div>
            </div>
            <div class="div10">
            </div>
            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                className='text-center'>
                <h1>Playlist Link: {window.location.href}</h1>
                <h1>Rate: {[...Array(5)].map((_, index) => (
                    <span
                        key={index}
                        style={{
                            cursor: "pointer",
                            color: index < rating ? "gold" : "gray",
                            fontSize: "24px",
                        }}
                        onClick={() => setRating(index + 1)}
                    >
                        ★
                    </span>
                ))}</h1>
                <h1>Leave a Comment!</h1>
                <br />
                <TextArea style={{ resize: "vertical" }} onChange={(e) => setComment(e.target.value)} value={comment} placeholder='Enter your comment here...' />
                <Button onClick={() => { onSubmit(rating, comment); alert("Review submitted! Thank you."); }}>Submit</Button>
            </Popup>
        </Card>
    );
}