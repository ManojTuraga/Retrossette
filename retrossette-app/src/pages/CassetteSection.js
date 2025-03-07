/******************************************************************************
Module: app.js
Creation Date: February 19th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga,

Description:
    This files defines the behavior for the cassette section on the create 
    playlists page. This page will show the progress of how much of the
    cassette is filled up

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

/******************************************************************************
IMPORTS
******************************************************************************/
// Import the react framework from the react library
import React from 'react';

// Import the styling for this section
import '../css/CassetteSection.css';

/******************************************************************************
PROCEDURES
******************************************************************************/

/*
* This functions defines the rendering logic for the
* cassette component of the page. This page takes in 
* The percent of the progress and changes the amount
* that the bar is filled
*/
const CassetteSection = ( { progressPercent } ) => {
  // Return the rendering for this continer, which is just
  // the container for the cassettes and the progress bar for
  // how much of the tape is used
  return (
    <div className="cassette-container">
      <div className="progress-bar">
        <div className="progress-fill" style={{ height: `${progressPercent}%` }}></div>
      </div>
    </div>
  );
};

// Export the CassetteSection procedure
export default CassetteSection;
