import React from 'react';
import { MailIcon, LinkIcon } from '@heroicons/react/outline';

function Header() {
    return (
        <header className="text-white text-center p-6 shadow-lg">
            <h1 className="text-2xl md:text-4xl font-bold">Currency Exchange Dashboard</h1>
            <div className="flex justify-center items-center mt-2 space-x-4">
                <p className="flex items-center">
                    <span className="font-medium">Author: Zixuan Wan</span> 
                </p>
                <a href="mailto:terry.one@outlook.com" className="flex items-center hover:underline">
                    <MailIcon className="h-5 w-5 mr-1" />terry.one@outlook.com
                </a>
                <a href="https://www.linkedin.com/in/zixuan-wan-b53643235/" target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                    <LinkIcon className="h-5 w-5 mr-1" />LinkedIn
                </a>
                <a href="https://github.com/Terry-One" target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                    <LinkIcon  className="h-5 w-5 mr-1" />Github
                </a>
            </div>
        </header>
    );
}

export default Header;
