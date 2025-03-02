/******************************************************************************
Module: index.js
Creation Date: February 20th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga, Connor Forristal, Ceres Botkin

Description:
    This file is the index javascript file of the react frontend. All react
    components are initialized from this parent file and this file is the
    start of all renderign process

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
// Import the React from react module to interface with the
// react library
import React from 'react';

// Import the DOM renderer for react so we can add
// DOM objects
import ReactDOM from 'react-dom/client';

// Import the global css
import './index.css';

// Import the main application from the component library
import App from './components/App.js';


// Create a root object that will host the application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Have the dom object render the main application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

