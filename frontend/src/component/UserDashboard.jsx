import React, { useState } from 'react';
import Usernav from './Usernav';
import Card from './Card';
import Footer from './Footer';

function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
      <div className="flex flex-col min-h-screen">
      {/* User Navigation at the top */}
      <div>
          <Usernav setSearchTerm={setSearchTerm}  />
      </div>
      {/* Main content area that flows between Usernav and Footer */}
      <div className="flex-grow">
          <Card searchTerm={searchTerm}  />
      </div>
      {/* Sticky Footer at the bottom */}
      <div className="mt-auto">
          <Footer />
      </div>
  </div>
  );
}

export default UserDashboard;
