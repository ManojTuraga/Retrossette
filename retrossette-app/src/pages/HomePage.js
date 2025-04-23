/******************************************************************************
Module: HomePage.js
Creation Date: April 3rd, 2025
Authors: Connor Forristal
Contributors: Manoj Turaga, Connor Forristal

Description:
    This page defines the logic for the homepage

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
    
Sources: React Documentation, Socketio Documentation, Pixel retroui documentation
******************************************************************************/

/*******************************************************************************
IMPORTS
*******************************************************************************/
// Import the Genrebox component
import GenreBox from '../components/genreBox';

// Import the socket componenet
import { SOCKET } from '../components/socket';

// Import the react library and the required hooks
import React, { useEffect, useState } from 'react';

// Import the Card from retroui
import { Card, Popup, Button } from 'pixel-retroui';

import static_img from '../images/static.png'
import active_img from '../images/active.gif'


// Get the button sound effect
import ButtonSound from "../boombox_assets/button_press_sfx.mp3"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// This function defines the audio playback for when a button is clicked
function ClickSound() {
    let audio = new Audio(ButtonSound);
    sleep(1000);
    audio.play().catch(error => console.error("Audio play failed:", error));
}

/* This function defines the rendering behavior of this componenet */
function HomePage() {
    // Define a state variable to store all the cassettes to their genre
    const [cassettesByGenre, setCassettesByGenre] = useState([]);
    const [mostPopular, setMostPopular] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    // Define a state variable for the name of the playlist
    const [selectedName, setSelectedName] = useState("");

    // Define a state variable for the id of the playlist
    const [selectedID, setSelectedID] = useState(0);

    // Query the database to first get all the genres and then
    // to get currently every cassette by their genre
    useEffect(() => {
        SOCKET.emit("/api/get_all_genres", {}, (first_response) => {
            console.log(first_response["message"]);
            for (let genre of first_response["message"]) {
                SOCKET.emit("/api/get_cassette_by_genre", { id: genre["id"] }, (response) => {
                    setCassettesByGenre(prevState => [
                        ...prevState,
                        { name: genre["name"], cassettes: response["message"] }
                    ]);


                })
            }
        })
        SOCKET.emit("/api/get_most_popular", {}, (first_response) => {
            console.log( first_response["message" ])
            setMostPopular( first_response[ "message" ] )
        })
    }, [])

    // Define the rendering behavior for this componenet
    return (
        <>
            <div className="grid grid-cols-3 gap-4 mx-12">
                <Card className="col-start-1 col-span-3 p-4 h-100 text-2xl"
                    style={{ background: "linear-gradient(45deg, #999 5%, #fff 10%, #ccc 30%, #ddd 50%, #ccc 70%, #fff 80%, #999 95%)", }} borderColor='#ffffff'>
                    <h1>Most Popular</h1>
                    <div className="flex h-5/6 w-full justify-center align-center">
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-10 justify-items-center place-items-center">
                            {mostPopular.map((song) => {
                                return (<div className="h-auto text-white aspect-square">
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <img onClick={()=>{setSelectedID(song["id"]); setSelectedName(song["name"]); setIsPopupOpen(true)}} className="absolute opacity-0 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105 origin-center" src={active_img} alt="GIF" />
                                        <img className="opacity-100 hover:opacity-0 transition-opacity duration-300" src={static_img} alt="Static" />
                                    </div>
                                </div>)
                            })}

                        </div>
                    </div>
                </Card>
                {cassettesByGenre.map((genre) => (
                    <GenreBox Genre={genre["name"]} CassetteNames={genre["cassettes"]} />
                ))}
            </div>
            <Popup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                className='text-center'
            >
                <h1>Cassette Name: {selectedName}</h1>
                <Button onClick={() => { ClickSound(); window.location.href = `/PlayMusic?id=${selectedID}`; }}>Play Cassette</Button>
            </Popup>
        </>
    )
}

export default HomePage;