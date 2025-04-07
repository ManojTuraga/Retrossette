// From the react library import the React framework
// and the useEffect and useState functions
import React, { useState } from 'react';

// Import the socket created in the socket component
import { SOCKET } from '../components/socket';


function GetRecommendation()
    {
    SOCKET.emit( "/api/get_recommendation", {}, ( response ) =>
            {
            } );
    }

export default GetRecommendation;