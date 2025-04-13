/******************************************************************************
Module: CreatePlaylist.js
Creation Date: February 18th, 2025
Authors: Manoj Turaga
Contributors: Manoj Turaga, Ceres Botkin

Description:
    This page defines the rendering behavior of the CreatePlaylist section
    of the app. Here, the user can define the songs that are in a playlist
    and hte name of the playlist

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
    
Sources: React Documentation, Socketio Documentation, Pixel-Retrioui Documentation
******************************************************************************/

/*******************************************************************************
IMPORTS
*******************************************************************************/
// From the react library, import the React framework and the use state
// function
import React, { useState } from 'react';

// Import the styling for this page
import '../css/CreatePlaylist.css';

// Import the socket io object created in the socket componenet
import { SOCKET } from '../components/socket';

// Import the add an zip functions from lodash
import {add, zip} from 'lodash'
import cassette from '../images/active.gif'

// Import the requiree  
import {Card, ProgressBar, Button, Input, Popup} from "pixel-retroui"

/*******************************************************************************
VARIABLES
*******************************************************************************/
// Define a variable to determine the maximum capacity
// of a cassette (in milliseconds)
const MAX_TIME_IN_MS = 3600000

/*******************************************************************************
PROCEDURES 
*******************************************************************************/
/*
* This function defines the rendering behavior of the Create Playlists
* Componenet of the page
*/
function CreatePlaylist ()
    {
    // Define a state variable to hold the value
    // of the serch input
    const [searchInput, setSearchInput] = useState('');
   
    // Define a state variable to hold the value o fhte
    // playlist name input
    const [playlistNameInput, setPlaylistNameInput] = useState('');
    
    // Define a state variable to hold the value of the total
    // duration of the music
    const [totalDuration, setTotalDuration] = useState(0);
    
    // Define a state variable to hold the songs that are
    // Currently selected to be in the playlist
    const [currSelectedSongs, setCurrSelectedSongs] = useState([]);
    
    // Define a state variable to hold the songs that we
    // currently searched for
    const [searchedSongs, setSearchedSongs] = useState([]);

    // Define a state variable to store all the genres
    // that the user can associate their song with
    const [allGenres, setAllGenres] = useState([]);

    // Store a state variable to link genres to their associations
    const [genreAssociationValues, setGenreAssociationValues] = useState([]);

    // Define a state variable to store the values for the dropdown
    const [genreDropdownValues, setGenreDropdownValues] = useState([]);

    // Define a state variable to show the popup
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Define a state variable to determine the text of the popup
    const [popupText, setPopupText] = useState('');

    // Get all the genres that the database supports
    SOCKET.emit( "/api/get_all_genres", { }, ( response ) =>
        {
        setAllGenres( response[ "message" ] );  
        } )

    // Define a local function to handle changes to the input
    // in the search bar
    function handleSearchBarChange( e )
        {
        setSearchInput( e.target.value );
        }

    // Define a local function to handle changes to the input
    // in the search bar
    function handlePlaylistNameChange( e )
        {
        setPlaylistNameInput( e.target.value );
        }

    // Define a local function to handle a click on the submit
    // button
    function sendPlaylist( e )
        {
        // Prevent the default behavior on a button click
        e.preventDefault();

        if((playlistNameInput.trim().length === 0) || ( currSelectedSongs.length === 0 ) || 
        ( genreDropdownValues.length === 0 ) || genreAssociationValues.reduce((acc, curr) => acc + Number(curr), 0) !== 100)
            {
            setIsPopupOpen( true );
            setPopupText("Error! There are missing fields");
            }
        else
            {
            // Send the playlist information to the server and on a response, redirect
            // to the specified page
            SOCKET.emit( "/api/submit_playlist", { message : { name : playlistNameInput, songs : currSelectedSongs, genres: zip( genreDropdownValues, genreAssociationValues ) } }, ( response ) =>
                {
                window.location.href = response[ "post_submit_url" ];    
                } )
            }
        }

        // This function handles the behavior of adding
    // a new slider for a genre
    const addGenre = () => {
        // Essentially, only add up to the total number of
        // genres that are supported
        if (genreAssociationValues.length < allGenres.length) {
        // Add a new association to the list
        setGenreAssociationValues([...genreAssociationValues, 0]);

        // The following for loop is to ensure that
        // the new dropdown takes on a value that
        // corresponds to the first available value
        for( let i = 0; i < allGenres.length; i++ )
            {
            if( !(genreDropdownValues.includes( allGenres[ i ].name ) ) )
            {
            setGenreDropdownValues([...genreDropdownValues, allGenres[ i ].name]);
            break;
            }
            }
        }
    };

    // Define a local function that will handle searches for
    // music on spotify
    function sendSearchQuery( e )
        {

        if( e.key == "Enter" )
            {
            // Send the search query to the server and on the
            // response, add all the songs to the image grid
            SOCKET.emit( "/api/search_for_song", { message: searchInput.trim() }, ( response ) => 
                { 
                let newElements = [];
                for( let song of response[ "items" ] ) 
                    {
                    newElements.push(
                        {
                        name: song[ "name" ],
                        uri: song[ "uri" ],
                        duration_ms: song[ "duration_ms" ],
                        image: song[ "album" ][ "images" ][ 0 ][ "url" ],
                        artists: song[ "artists" ].map( s => s[ "name" ] ),
                        song_type: 0
                        });
                    }
                    setSearchedSongs(newElements);
                } );
            }
        }
    
    // Local function to update the total duration of all the songs
    // that are selected to be in the playlist
    function updateTotalDuration( inc )
        {
        if( totalDuration + inc > MAX_TIME_IN_MS )
            {
                setIsPopupOpen( true );
                setPopupText("Error! Length of Playlist exceeds 60 minutes");
            }
        else
            {
            setTotalDuration( totalDuration + inc );
            }
        }

    // Local function to update the current selected songs
    // when a song is clicked
    function updateFromCurrSelectedSongs( song, index )
        {
        // Reduce the total duration of the playlist
        updateTotalDuration( 0 - Number( song[ "duration_ms" ] ) );

        // Remove the song from the list of currently songs
        // while preserving the order of the rest of the songs
        let newList = [...currSelectedSongs];
        newList.splice( index, 1 );
        setCurrSelectedSongs( newList );
        }

    // Local function to update the currently selected songs when 
    // a song is added to the currently selected songs
    function updateFromSearchedSongs( song, index )
        {
        setCurrSelectedSongs( [...currSelectedSongs, song ] );
        updateTotalDuration( Number( song[ "duration_ms" ] ) );
        }

    // The following is a local function for handling input change on the slide
  const handleChange = (index, event) => {
    // Create a new list and update list with value from slide 
    const newValues = [...genreAssociationValues];
    newValues[index] = event.target.value;

    // Compute the sum of all associations
    const sumOfValues = newValues.reduce((acc, curr) => acc + Number(curr), 0);

    // Only truly update teh associations if the sum of all
    // assocations is less than or equal to 100
    if (sumOfValues <= 100) {
        setGenreAssociationValues(newValues);
    }
  };

    // This is a local function for when a new value
    // is selected in the dropdown
    const handleSelectChange = (index, event) => {
        // Replace the old value in the list with the
        //  new value and update the global dropdown
        // values variable
        const newDropdownValues = [...genreDropdownValues];
        newDropdownValues[index] = event.target.value;
        setGenreDropdownValues(newDropdownValues);
    };


    // This is a local function to handle when a slider is deleted
    const handleDelete = (index) => {
        // The function takes the index that was passed in and 
        // Just removes it from the corresponding arrays
        const newValues = genreAssociationValues.filter((_, i) => i !== index);
        const newDropdownValues = genreDropdownValues.filter((_, i) => i !== index);
        setGenreAssociationValues(newValues);
        setGenreDropdownValues(newDropdownValues);
    };

    // This is a local function to handle all the possible dropdown values
    const getDropdownOptions = (index) => {
        // Basically a dropdown should not include a selection if
        // is already included as a selection in a different dropdown
        return allGenres
        .map((genre) => genre.name)
        .filter((name) => !genreDropdownValues.includes(name) || genreDropdownValues[index] === name);
    };
    
    // Render the components that are required for this page
    return (
        <div className="grid grid-rows-5 grid-cols-5 gap-x-4 mx-12 h-[calc(100vh-65px)]">
            <Card className="col-start-1 col-span-2 row-start-1 row-span-5 space-y-8 scrollbar-hide overflow-y-auto">
                <Input onChange={ handlePlaylistNameChange } className="w-5/6 mx-auto block col-span-full place-self-center" placeholder="Cassette Name"/>
                <img src={cassette} alt="" className="w-5/6 mx-auto col-span-full place-self-center"/>  
                <ProgressBar size="md" progress={totalDuration * 100 / MAX_TIME_IN_MS}></ProgressBar>                
                <Button onClick={addGenre}>Add a Genre</Button>

                <Card className="flex flex-col overflow-auto">
                      <div className="text-center mt-2">{genreAssociationValues.join(' - ')}</div>
                      <div className={`mt-4`}>
                        {genreAssociationValues.map((value, index) => (
                          <div key={index} className="flex items-center mb-2" style={{ top: `${index * 2}rem`, transform: 'translateY(-50%)' }}>
                            <select
                                value={genreDropdownValues[index]}
                                onChange={(event) => handleSelectChange(index, event)}
                                className="mr-2"
                              >
                                {getDropdownOptions(index).map((option, idx) => (
                                  <option key={idx} value={option}>{option}</option>
                                ))}
                              </select>
                
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={value}
                              onChange={(event) => handleChange(index, event)}
                              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer range-input"
                              style={{
                                zIndex: index + 1
                              }}
                            />
                            
                            <Button
                              onClick={() => handleDelete(index)}
                            >
                              Delete
                            </Button>
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Button type="submit" onClick={sendPlaylist} className="self-end">Submit</Button>
            </Card>

            <Card className="col-start-3 col-span-3 row-start-1 row-span-2">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 content-start gap-4 rounded-b-lg h-full overflow-y-auto scrollbar-hide p-4">
                    <div className="col-span-full text-2xl">Selected Songs</div>

                    { currSelectedSongs.map((song, index) => (
                        <Card className="h-auto text-white aspect-square relative flex items-center justify-center transition-transform duration-300 transform hover:scale-105">
                            <img
                                key={index}
                                src={song["image"]}
                                alt={`${song["name"]} by ${song["artists"]}`}
                                title={`${song["name"]} by ${song["artists"]}`}
                                onClick={() => updateFromCurrSelectedSongs(song, index)}
                            />
                        </Card>
                    
                    
                    ))}
                </div>
            </Card>

            <Card className="col-start-3 col-span-3 row-start-3 row-span-3">
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 content-start gap-4 rounded-b-lg  overflow-y-auto scrollbar-hide p-4 h-full">
                    <div className="grid grid-cols-5 col-span-full sticky">
                        <Input onKeyDown={ sendSearchQuery } onChange={ handleSearchBarChange } className="col-span-2" placeholder="Search For Song"/>
                    </div>
                    { searchedSongs.map((song, index) => (
                        <Card className="h-auto text-white aspect-square relative flex items-center justify-center transition-transform duration-300 transform hover:scale-105">
                        <img
                            key={index}
                            src={song["image"]}
                            alt={`${song["name"]} by ${song["artists"]}`}
                            title={`${song["name"]} by ${song["artists"]}`}
                            onClick={() => updateFromSearchedSongs(song, index)}
                        />
                        </Card>
                    ))}
                </div>
            </Card>

        <Popup
        isOpen={isPopupOpen}
        onClose={()=>setIsPopupOpen( false )}
        className='text-center'
        >
            <h1>{popupText}</h1>
        </Popup>
        </div>
    );
};

// Export the componenet
export default CreatePlaylist;
