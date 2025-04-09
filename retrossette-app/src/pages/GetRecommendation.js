// From the react library import the React framework
// and the useEffect and useState functions
import React, { useState } from 'react';

// Import the socket created in the socket component
import { SOCKET } from '../components/socket';

import { Button, Card } from 'pixel-retroui';

function GetRecommendation()
    {
        return (
            <div>
              <h1 className="text-2xl font-minecraft mb-4">Welcome to My Retro App</h1>
              <Card className="p-4 mb-4">
                <h2>This is a pixel-styled card</h2>
                <p>You can put anything inside!</p>
              </Card>
              <Button 
  bg="#c381b5" 
  textColor="#fefcd0"
  shadow="#fefcd0"
  className="px-6 py-2"
>
  Custom Button
</Button>
            </div>
          );
    }

export default GetRecommendation;