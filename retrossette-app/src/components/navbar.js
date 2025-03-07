import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar()
    {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <nav className="bg-[#3b3b3b]">
                <div className="lg:flex flex-grow items-center">
                <Link to="" className="flex text-white hover:bg-[#e05ccd] px-3 py-2">Home</Link>
                <Link to="/CreatePlaylist" className="text-white hover:bg-[#e05ccd] px-3 py-2">Create</Link>
                <Link to="/ViewPlaylists" className="text-white hover:bg-cyan-500 px-3 py-2 rounded-md">View</Link>
                <Link to="/PlayMusic" className="text-white hover:bg-pink-500 px-3 py-2 rounded-md">Play</Link>
                </div>
            </nav>
        );
    }
