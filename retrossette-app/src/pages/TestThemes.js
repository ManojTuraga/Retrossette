/******************************************************************************
NOTE: THIS PAGE IS JUST A TEST IMPLEMENTATION OF WHAT CUSTOM THEMES WOULD LOOK
LIKE. THIS FILE IS NOT RELEASE CODE AS THIS IS JUST A PROOF OF CONCEPT
REMOVE THIS FILE WHEN IT IS NO LONGER NEEDED
******************************************************************************/

// From the react library import the React framework
// and the useEffect and useState functions
import React, { useState } from 'react';

// Import the socket created in the socket component
import { SOCKET } from '../components/socket';

/* This function defines the rendering behavior of the test themes page */
function TestThemes()
    {
    // Define state variables to hold the all the themes as well as the
    // currently selected themes' relevant style configurations
    const [ listOfThemes, setListOfThemes ] = useState( [] );
    const [ primaryColor1, setPrimaryColor1 ] = useState( "" );
    const [ primaryColor2, setPrimaryColor2 ] = useState( "" );
    const [ secondaryColor1, setSecondaryColor1 ] = useState( "" );
    const [ secondaryColor2, setSecondaryColor2 ] = useState( "" );
    const [ primaryFont, setPrimaryFont ] = useState( "" );
    const [ secondaryFont, setSecondaryFont ] = useState( "" );
    
    // Define a function to update the list of themes
    function updateListOfThemes( themes )
        {
        setListOfThemes( themes )
        }

    // Define a the behavior when a theme is clicked
    function handleThemeClicked( theme )
        {
        setPrimaryColor1( theme[ "primary_color_1" ] );
        setPrimaryColor2( theme[ "primary_color_2" ] );
        setSecondaryColor1( theme[ "secondary_color_1" ] );
        setSecondaryColor2( theme[ "secondary_color_2" ] );
        setPrimaryFont( theme[ "primary_font" ] );
        setSecondaryFont( theme[ "secondary_font" ] );
        }
    
    // Get all the themes for the server
    SOCKET.emit( "/api/get_themes", {}, ( response ) =>
        {
        } );

    // Define a style dictionary for the first primary color
    let style1 =
        {
        color: primaryColor1
        };
        
    // Define a style dictionary for the second primary color
    let style2 =
        {
        color: primaryColor2
        };

    // Define a style dictionary for the first secondary color
    let style3 =
        {
        color: secondaryColor1
        };
    
    // Define a style dictionary for the second secondary color
    let style4 =
        {
        color: secondaryColor2
        };

    // Define a style dictionary for the primary font
    let style5 =
        {
        fontFamily : primaryFont
        };

    // Define a style dictionary for the secondary font
    let style6 =
        {
        fontFamily : secondaryFont
        }

    // Define the rendering behavior for this component
    return(
        <ul>
            {
            listOfThemes.map( ( theme ) =>(
                <li onClick={ () => handleThemeClicked( theme ) }>{ theme[ "name" ] }</li>
            ) )
            }
            <br/>
            <br/>
            <h1 style={ style1 }>Primary Color 1</h1>
            <h1 style={ style2 }>Primary Color 2</h1>
            <h1 style={ style3 }>Secondary Color 1</h1>
            <h1 style={ style4 }>Secondary Color 2</h1>
            <h1 style={ style5 }>Primary Font</h1>
            <h1 style={ style6 }>Secondary Font</h1>
        </ul>
    )
    }

export default TestThemes;