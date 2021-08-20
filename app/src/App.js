import './App.css';
import { Login, Person, Todo } from '@microsoft/mgt-react';

function App() {
  return (
    <div className="App">
      <header className="">
        <a className="App-link" href="/login"> Login with Google </a>
        <a className="App-link" href="/logout"> Logout</a>
      </header>
      <body>
        <Login />
        <Person personQuery="me" personCardInteraction="hover" showPresence="true" view="twolines" />
        <Todo />
      </body>
    </div>
  );
}

export default App;
