import React from 'react';
import { Outlet } from 'react-router-dom';
import Usernav from './Usernav';
import Footer from './Footer';

function Layout() {
    return (
        <div className="flex flex-col min-h-screen w-full overflow-hidden">
            {/* User Navigation at the top */}
            <Usernav />
            {/* Main content area that flows between Usernav and Footer */}
            <div className="flex-grow w-full overflow-y-auto">
                <Outlet />
            </div>
            {/* Sticky Footer at the bottom */}
            <Footer />
        </div>
    );
}

export default Layout;
