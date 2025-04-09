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


import { FaHome, FaMusic, FaTape } from 'react-icons/fa'

import { MdMusicVideo } from "react-icons/md";

import { Button } from 'pixel-retroui';
/******************************************************************************
PROCEDURES
******************************************************************************/
/* This function defines the rendering behavior of the navbar */
export default function Navbar({ ProfileName, ProfileImage })
    {
        // The following variable is not being used yet
        // This will be used when we are doing differnet
        // rendering behaviors based on screen size
        const [isOpen, setIsOpen] = useState(false);

        // Define the rendering the rendering behavior of this component
        return (
            <nav className="navbar sticky top-0 flex items-center justify-between px-4">
    <div className="navbar-brand font-minecraft">Retrossette</div>

    {/* Button Container */}
    <div className="flex space-x-4 justify-center flex-grow">
        <Link to="">
            <Button>
                <span className="flex items-center space-x-2">
                    <FaHome />
                    <span>Home</span>
                </span>
            </Button>
        </Link>

        <Link to="/CreatePlaylist">
            <Button>
                <span className="flex items-center space-x-2">
                    <FaMusic />
                    <span>Create</span>
                </span>
            </Button>
        </Link>

        <Link to="/ViewPlaylists">
            <Button>
                <span className="flex items-center space-x-2">
                    <MdMusicVideo />
                    <span>View</span>
                </span>
            </Button>
        </Link>
    </div>

    {/* Profile Information */}
    <div className="flex flex-row-reverse items-center">
        <div className="px-5 font-minecraft">{ProfileName}</div>
        <img className="w-9 h-9 rounded-full" src={ProfileImage} alt="Rounded avatar" />
    </div>
</nav>
        );
    }
