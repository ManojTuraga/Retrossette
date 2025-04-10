import React, { useState } from 'react';

// Import the Link component from the react router dom
import { Link } from 'react-router-dom';

import static_img from '../images/static.png'
import active_img from '../images/active.gif'

import {Card, Popup, Button} from 'pixel-retroui'
/******************************************************************************
PROCEDURES
******************************************************************************/



/* This function defines the rendering behavior of the navbar */
export default function GenreBox({Genre, CassetteNames})
    {
    function handlePlaylistSelected( name, id )
        {
        setIsPopupOpen( true );
        setSelectedName( name );
        setSelectedID( id )
        }
        
        const [isPopupOpen, setIsPopupOpen] = useState(false);
        const [selectedName, setSelectedName] = useState("");
        const [selectedID, setSelectedID] = useState(0);
        
        return (

            <>
            <Card className="col-span-1 overflow-y-auto scrollbar-hide p-4 h-[60vh]">
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 content-start gap-4">
                        <div className="col-span-full text-2xl">{Genre}</div>
                        {
                        CassetteNames.map( ( playlist ) =>(
                            <div className="h-auto text-white aspect-square">

                        <div className="relative w-full h-full flex items-center justify-center">
                                <img onClick={ () => handlePlaylistSelected( playlist[ "name" ], playlist[ "id" ] ) } className="absolute opacity-0 hover:opacity-100 transition-opacity duration-300 transform hover:scale-105 origin-center" src={active_img} alt="GIF" />
                                <img className="opacity-100 hover:opacity-0 transition-opacity duration-300" src={static_img} alt="Static" />
                            </div>
                            </div>
                        ) )
                        }
                    </div>
            </Card>
            <Popup
            isOpen={isPopupOpen}
            onClose={()=>setIsPopupOpen( false )}
            className='text-center'
            >
                <h1>Cassette Name: {selectedName}</h1>
                <Button onClick={()=>{window.location.href = `/PlayMusic?id=${selectedID}`;}}>Play Cassette</Button>
            </Popup>
            </>
        );
    }



