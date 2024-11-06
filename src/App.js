import React, { useState } from 'react';
import Auth from './Auth';
import Todo from './Todo';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {user ? <Todo user={user} /> : <Auth setUser={setUser} />}
    </div>
  );
}

export default App;