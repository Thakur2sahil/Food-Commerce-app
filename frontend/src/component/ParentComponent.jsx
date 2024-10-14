import React, { useState } from 'react';
import Usernav from './Usernav';
import Card from './Card';

function ParentComponent() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      <Usernav setSearchTerm={setSearchTerm} />
      <Card searchTerm={searchTerm} />
    </div>
  );
}

export default ParentComponent;
