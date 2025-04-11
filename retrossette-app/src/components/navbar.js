/******************************************************************************
Module: navbar.js
Creation Date: March 7th, 2025
Authors: Connor Forristal
Contributors: Connor Forristal, Manoj Turaga

Description:
    This module defines the behavior of the navbar

Inputs:
    None

Outputs:
    Nav Bar component

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
/******************************************************************************
IMPORTS
******************************************************************************/
// Import the react framework and the use state function
// from the react library
import React, { useState } from 'react';

// Import the Link component from the react router dom
import { Link } from 'react-router-dom';


import { FaHome, FaPencilAlt, FaMusic } from 'react-icons/fa'

import { Button } from 'pixel-retroui';

import ButtonSound from "../boombox_assets/button_press_sfx.mp3"
/******************************************************************************
PROCEDURES
******************************************************************************/
function AlternatingText({ text }) {
    return (
        <div className="navbar-brand font-minecraft drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
        {text.split("").map((char, index) => (
            <span key={index} className={index % 2 === 0 ? "text-cyan-500" : "text-pink-700"}>
                {char}
            </span>
        ))}
    </div>
        
    );
}

function ClickSound()
    {
    let audio = new Audio( ButtonSound );
    audio.play().catch(error => console.error("Audio play failed:", error));
    }


/* This function defines the rendering behavior of the navbar */
export default function Navbar({ ProfileName, ProfileImage })
    {
        // The following variable is not being used yet
        // This will be used when we are doing differnet
        // rendering behaviors based on screen size
        const [isOpen, setIsOpen] = useState(false);

        // Define the rendering the rendering behavior of this component
        return (
            <nav className="z-50 navbar sticky top-0 flex items-center justify-between px-4" style={{ backgroundColor: "#3b3b3b" }}>
                <AlternatingText text={"Retrossette"} />

                {/* Button Container */}
                <div className="flex space-x-4 justify-center flex-grow">
                    <Link to="">
                        <Button onClick={ClickSound}>
                            <span className="flex items-center space-x-2">
                                <FaHome />
                                <span>Home</span>
                            </span>
                        </Button>
                    </Link>
                    <Link to="/CreatePlaylist">
                        <Button onClick={ClickSound}>
                            <span className="flex items-center space-x-2">
                                <FaPencilAlt />
                                <span>Create</span>
                            </span>
                        </Button>
                    </Link>
                    <Link to="/ViewPlaylists">
                        <Button onClick={ClickSound}>
                            <span className="flex items-center space-x-2">
                                <FaMusic />
                                <span>View</span>
                            </span>
                        </Button>
                    </Link>
                </div>

                {/* Profile Information */}
                <div className="flex flex-row-reverse items-center">
                    <div className="px-5 font-minecraft text-white">{ProfileName}</div>
                    <img className="w-9 h-9 rounded-full" src={ProfileImage} alt="Rounded avatar" />
                </div>
            </nav>
        );
    }
