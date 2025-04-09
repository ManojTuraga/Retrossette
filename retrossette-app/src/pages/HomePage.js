
import GenreBox from '../components/genreBox';
import cassette from '../images/cassette_svg.svg'
import { SOCKET } from '../components/socket';
import React, { useEffect, useState } from 'react';


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

                <div className="col-start-1 col-span-3 bg-cyan-500 rounded-b-lg p-4 h-[calc(60vh-65px)]">
                    
                </div>
                { cassettesByGenre.map((genre) => (
                        <GenreBox Genre={ genre[ "name" ] }/>
                    ))} 
            </div>
        )
    }

export default HomePage;