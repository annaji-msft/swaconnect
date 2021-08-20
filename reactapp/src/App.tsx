import React, { useState, useEffect }from 'react';
import './App.css';
import { Get, Person, ViewType, MgtTemplateProps } from '@microsoft/mgt-react';
import { Providers, ProviderState } from '@microsoft/mgt-element';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

function useIsSignedIn(): [boolean] {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const updateState = () => {
      const provider = Providers.globalProvider;
      setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
    };

    Providers.onProviderUpdated(updateState);
    updateState();

    return () => {
      Providers.removeProviderUpdatedListener(updateState);
    }
  }, []);

  return [isSignedIn];
}

const MyPerson = (props: MgtTemplateProps) => {
  const person = props.dataContext as MicrosoftGraph.User;
  return <Person userId={person.userPrincipalName  as string}></Person>;
}

function App() {
  const [isSignedIn] = useIsSignedIn();

  return (
    <div className="App">
      <header>
        <a className="App-link" href="/login"> Login with Google </a>
        <a className="App-link" href="/logout"> Logout</a>
      </header>
      <div>
        {isSignedIn &&
          <div>
          <Person personQuery="me" view={ViewType.twolines} />
          <Get resource="me">
            <MyPerson />
          </Get>
        </div>
        }
      </div>
    </div>
  );
}

export default App;
