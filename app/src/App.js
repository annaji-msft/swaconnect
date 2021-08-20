import './App.css';
import { Login } from '@microsoft/mgt-react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <a className="App-link" href="/login"> Login with Google </a>
        <a className="App-link" href="/logout"> Logout</a>
      </header>
      <body>
        <Login />
      </body>
    </div>
  );
}

export default App;
