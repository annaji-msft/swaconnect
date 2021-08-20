import React , { useState, useEffect } from 'react';
import { Get, Person, ViewType } from '@microsoft/mgt-react';
import { Providers, ProviderState } from '@microsoft/mgt-element';

function useIsSignedIn()  {
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

const MyPerson = (props) => {
  const person = props.dataContext;
  return <Person userId={person.userPrincipalName}></Person>;
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
