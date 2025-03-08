// From the react library import the React framework
// and the useEffect and useState functions
import React, { useEffect, useState } from 'react';

// Import the socket created in the socket component
import { SOCKET } from '../components/socket';

function TestThemes()
    {
    const [ listOfThemes, setListOfThemes ] = useState( [] );
    const [ primaryColor1, setPrimaryColor1 ] = useState( "" );
    const [ primaryColor2, setPrimaryColor2 ] = useState( "" );
    const [ secondaryColor1, setSecondaryColor1 ] = useState( "" );
    const [ secondaryColor2, setSecondaryColor2 ] = useState( "" );
    const [ primaryFont, setPrimaryFont ] = useState( "" );
    const [ secondaryFont, setSecondaryFont ] = useState( "" );

    function updateListOfThemes( themes )
        {
        setListOfThemes( themes )
        }

    function handleThemeClicked( theme )
        {
        setPrimaryColor1( theme[ "primary_color_1" ] );
        setPrimaryColor2( theme[ "primary_color_2" ] );
        setSecondaryColor1( theme[ "secondary_color_1" ] );
        setSecondaryColor2( theme[ "secondary_color_2" ] );
        setPrimaryFont( theme[ "primary_font" ] );
        setSecondaryFont( theme[ "secondary_font" ] );
        }

    SOCKET.emit( "/api/get_themes", {}, ( response ) =>
        {
        updateListOfThemes( response[ "message" ] );
        } );

    let style1 =
        {
        color: primaryColor1
        };
        
    let style2 =
        {
        color: primaryColor2
        };

    let style3 =
        {
        color: secondaryColor1
        };
    
    let style4 =
        {
        color: secondaryColor2
        };

    let style5 =
        {
        fontFamily : primaryFont
        };

    let style6 =
        {
        fontFamily : secondaryFont
        }

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