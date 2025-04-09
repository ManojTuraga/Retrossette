import React, { useState } from 'react';

// Import the Link component from the react router dom
import { Link } from 'react-router-dom';
/******************************************************************************
PROCEDURES
******************************************************************************/
/* This function defines the rendering behavior of the navbar */
export default function GenreBox({Genre, CassetteNames})
    {

        function handlePlaylistSelected( id )
        {
        window.location.href = `/PlayMusic?id=${id}`;
        }
        
        return (
            <div className="col-span-1 rounded-lg bg-pink-700 overflow-y-auto scrollbar-hide p-4 h-[60vh]">
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 content-start gap-4">
                        <div className="col-span-full text-white text-2xl">{Genre}</div>
                        {
                        CassetteNames.map( ( playlist ) =>(
                            <div onClick={ () => handlePlaylistSelected( playlist[ "id" ] ) } 
                            className="h-auto bg-cyan-500 text-white aspect-square">
                                { playlist[ "name" ] }, {playlist[ "id" ]}
                            </div>
                        ) )
                        }
                    </div>
                </div>
        );
    }



