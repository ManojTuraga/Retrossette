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
import logo from '../images/layout/blank_avatar.png';

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
            <nav className="min-h-[65px] flex flex-row justify-center items-center items-stretch bg-[#3b3b3b] px-4 sticky w-full z-20 top-0 start-0 rounded-b-lg shadow-lg">
                <div className="flex min-h-100 flex-1 items-center">
                    <Link to="" className="text-center text-white hover:text-[#e05ccd] px-5">Home</Link>
                    <Link to="/CreatePlaylist" className="text-center text-white hover:text-[#e05ccd] px-5">Create</Link>
                    <Link to="/ViewPlaylists" className="text-center text-white hover:text-[#e05ccd] px-5">View</Link>
                </div>

                <div className="flex flex-1 min-h-100 justify-center items-center">
                    <div className="text-white">Retrossette</div>
                </div>

                <div className="flex flex-row-reverse flex-1 min-h-100 items-center">
                    <div className="text-white px-5">{ ProfileName }</div>
                    <img class="w-9 h-9 rounded-full" src={ProfileImage} alt="Rounded avatar"></img>
                </div>
            </nav>
        );
    }

Navbar.defaultProps = {
    ProfileImage: logo,
      };
