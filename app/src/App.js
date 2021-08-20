import './App.css';
import { Person, Get , PersonCard} from '@microsoft/mgt-react';

function App() {
  return (
    <div className="App">
      <header className="">
        <a className="App-link" href="/login"> Login with Google </a>
        <a className="App-link" href="/logout"> Logout</a>
      </header>
      <body>
        <Person personQuery="me" personCardInteraction="hover" showPresence="true" view="twolines" />
        <Get resource="me">
          <template>
            <Get resource="users/{{id}}/photo/$value" type="image">
              <template>
                <PersonCard personDetails="{{$parent}}" personImage="{{image}}"></PersonCard>
              </template>
            </Get>
          </template>
        </Get>
      </body>
    </div>
  );
}

export default App;
