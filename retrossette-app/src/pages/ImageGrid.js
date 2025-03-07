/******************************************************************************
Module: ImageGrid.js
Creation Date: February 18th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga, Ceres Botkin

Description:
    This page defines the rendering behavior of the image grid that appears
    on both the search for songs component and the currently selected song
    component

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
/*******************************************************************************
IMPORTS
*******************************************************************************/
// Import the React component from the framework
import React from 'react';

// Import the styling for this componenet
import '../css/ImageGrid.css';

/*******************************************************************************
PROCEDURES
*******************************************************************************/
/*
* This function handles the rendering for the image grid
* component of the page
*/
const ImageGrid = ({ onImageClick, listOfSongs, isTrackSelection }) => {
  // Using the properites passed in, render the componenet
  return (
      <div className={isTrackSelection ? "cassette-grid-container" : "grid-container"}>
      { listOfSongs.map((song, index) => (
        <img
          key={ index }
          src={ song[ "image" ] }
          alt={ `${song[ "name" ]} by ${song[ "artists" ]}` }
          title={ `${song[ "name" ]} by ${song[ "artists" ]}` }
          className={isTrackSelection ? "cassette-grid-image" : "grid-image"}
          onClick={() => onImageClick(song, index) }
        />
      ))}
    </div>
  );
};

// Export this component
export default ImageGrid;
