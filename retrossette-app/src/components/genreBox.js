import React, { useState } from 'react';

// Import the Link component from the react router dom
import { Link } from 'react-router-dom';

import static_img from '../images/static.png'
import active_img from '../images/active.gif'
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
                            className="h-auto text-white aspect-square">
                                { playlist[ "name" ] }, {playlist[ "id" ]}

                        <div className="relative w-full h-full flex items-center justify-center">
                                <img className="absolute opacity-0 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105 origin-center" src={active_img} alt="GIF" />
                                <img className="opacity-100 hover:opacity-0 transition-opacity duration-300" src={static_img} alt="Static" />
                            </div>
                            </div>
                        ) )
                        }
                    </div>
                </div>
        );
    }



