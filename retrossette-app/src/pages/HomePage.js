
import GenreBox from '../components/genreBox';
import cassette from '../images/cassette_svg.svg'
import { SOCKET } from '../components/socket';
import React, { useEffect, useState } from 'react';

import { Card } from 'pixel-retroui';


function HomePage()
    {
    const [cassettesByGenre, setCassettesByGenre] = useState( [] );
    

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