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
import { Card } from 'pixel-retroui';

/* This function defines the rendering behavior of this componenet */
function HomePage()
    {
    // Define a state variable to store all the cassettes to their genre
    const [cassettesByGenre, setCassettesByGenre] = useState( [] );

    // Query the database to first get all the genres and then
    // to get currently every cassette by their genre
    useEffect( () =>{
        SOCKET.emit( "/api/get_all_genres", { }, ( first_response ) =>
            {
            console.log( first_response[ "message" ] );
            for( let genre of first_response[ "message" ] ) 
                {
                SOCKET.emit( "/api/get_cassette_by_genre", { id: genre[ "id" ]  }, ( response ) =>
                        {
                            setCassettesByGenre(prevState => [ 
                                ...prevState, 
                                { name: genre["name"], cassettes: response["message"] } 
                            ]);
                            
                            
                        } )
                }
            } )
    }, [] )
    
        // Define the rendering behavior for this componenet
        return (
            <div className="grid grid-cols-3 gap-4 mx-12">

                <Card className="col-start-1 col-span-3 p-4 h-[calc(60vh-65px)] text-2xl">
                    <h1>Most Popular</h1>
                </Card>
                { cassettesByGenre.map((genre) => (
                        <GenreBox Genre={ genre[ "name" ]} CassetteNames={ genre[ "cassettes" ] }/>
                    ))} 
            </div>
        )
    }

export default HomePage;