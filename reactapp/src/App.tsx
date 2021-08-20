import React from 'react';
import './App.css';
import { Login } from '@microsoft/mgt-react';

function App() {
  return (
    <div className="App">
      <header>
        <Login />
        <a className="App-link" href="/login"> Login with Google </a>
        <a className="App-link" href="/logout"> Logout</a>
      </header>
    </div>
  );
}

export default App;
