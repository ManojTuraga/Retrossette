/******************************************************************************
NOTE: THIS IS CURRENLTY JUST A TESTBED FOR CODE THAT WE THINK WOULD LOOK
COOL. THIS IS NOT ACUTAL PRODUCTION CODE AND WILL BE DELETED
******************************************************************************/



// From the react library import the React framework
// and the useEffect and useState functions
import React, { useState } from 'react';

// Import the socket created in the socket component
import { SOCKET } from '../components/socket';

// Import the button and card components from retrio ui
import { Button, Card } from 'pixel-retroui';

// Import the cassette 8 bit gif 
// Source https://www.deviantart.com/wavegazer/art/80-s-Tape-Rainbow-543222626
import static_img from "../images/static.png"
import active_img from "../images/active.gif"

// Import the cassette buttons
import { FaPlay, FaPause, FaFastForward, FaFastBackward } from "react-icons/fa";

function GetRecommendation() {
    const [isPlay, setIsPlay] = useState(false);
    return (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] p-8 mt-[4rem]">
            {/* Adjust 4rem based on your navbar's height */}
            <Card className="w-4/5 h-4/5 bg-gray-300 grid grid-rows-6 grid-cols-12 rounded-lg shadow-lg p-2">
                {/* Add your grid content here */}
                <Card className="row-span-6 col-span-6 bg-blue-500 bg-opacity-50 z-10">
                    <div className="relative w-full h-full flex items-center justify-center z-[-1]">
                        {
                            isPlay ?
                                <img src={active_img} alt="Active" />
                                :
                                <img src={static_img} alt="Static" />
                        }
                    </div>
                </Card>
                <div className="row-span-1 col-start-8 col-span-5 flex justify-between items-center p-2">
                    <Button className="flex-1 flex justify-center">
                        <FaFastBackward />
                    </Button>
                    <Button className="flex-1 flex justify-center">
                        <FaFastForward />
                    </Button>
                    <Button onClick={() => setIsPlay(false)} className="flex-1 flex justify-center">
                        <FaPause />
                    </Button>
                    <Button onClick={() => setIsPlay(true)} className="flex-1 flex justify-center">
                        <FaPlay />
                    </Button>
                </div>

                <Card className="row-start-2 row-span-3 col-start-8 col-span-5 bg-white">Random Playing Animation</Card>
                <Card className="row-start-6 row-span-1 col-start-11 col-span-1 bg-green-500">Rate/Share</Card>
                <Card className="row-start-6 row-span-1 col-start-12 col-span-1 bg-green-500">Volume</Card>
            </Card>
        </div>
    );


}

export default GetRecommendation;