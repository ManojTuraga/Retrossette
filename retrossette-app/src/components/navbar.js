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

/******************************************************************************
PROCEDURES
******************************************************************************/
/* This function defines the rendering behavior of the navbar */
export default function Navbar()
    {
        // The following variable is not being used yet
        // This will be used when we are doing differnet
        // rendering behaviors based on screen size
        const [isOpen, setIsOpen] = useState(false);

        // Define the rendering the rendering behavior of this component
        return (
            <nav className="bg-[#3b3b3b]">
                <div className="lg:flex flex-grow items-center">
                <Link to="" className="flex text-white hover:bg-[#e05ccd] px-3 py-2">Home</Link>
                <Link to="/CreatePlaylist" className="text-white hover:bg-[#e05ccd] px-3 py-2">Create</Link>
                <Link to="/ViewPlaylists" className="text-white hover:bg-cyan-500 px-3 py-2 rounded-md">View</Link>
                <Link to="/PlayMusic" className="text-white hover:bg-pink-500 px-3 py-2 rounded-md">Play</Link>
                </div>
            </nav>
        );
    }
