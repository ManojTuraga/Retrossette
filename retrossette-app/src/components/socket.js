/******************************************************************************
Module: socket.js
Creation Date: February 18th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga

Description:
    This module initializes the socket io client for this application

Inputs:
    None

Outputs:
    Socket IO Socket

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
// Import the IO function from the socket.io library
import { io } from 'socket.io-client'

// Get the current server URL
const URL = process.env.SERVER_URL;

// Export a Socket created from the URL
export const SOCKET = io(URL)