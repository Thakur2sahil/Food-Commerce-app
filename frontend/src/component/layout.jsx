import React from 'react';
import { Outlet } from 'react-router-dom';
import Usernav from './Usernav';
import Footer from './Footer';

function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* User Navigation at the top */}
            <div>
                <Usernav />
            </div>
            {/* Main content area that flows between Usernav and Footer */}
            <div className="flex-grow">
                <Outlet />
            </div>
            {/* Sticky Footer at the bottom */}
            <div className="mt-auto">
                <Footer />
            </div>
        </div>
    );
}

export default Layout;
