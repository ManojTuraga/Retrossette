/******************************************************************************
Module: index.js
Creation Date: March 7th, 2025
Authors: Connor Forristal
Contributors: Connor Forristal, Manoj Turaga

Description:
    This file serves as the base tempalate for all the pages that are in the
    application. Any parent level components (like a navbar or a footer) can
    be added here

Inputs:
    None

Outputs:
    Web Page

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
// Import the Navbar component
import Navbar from './components/navbar'

// Import the Outlet component from the react router dom
import { Outlet } from 'react-router-dom'

/******************************************************************************
PROCEDURES
******************************************************************************/

/* This function is responsible for initializing the layout
    of the entire application */
function Layout()
    {
        // Render the required componenets for this page
        return (
            <>
                <Navbar/>
                <main>
                    <Outlet/>
                </main>
            </>
        )
        
    }

// Export the layout function
export default Layout;