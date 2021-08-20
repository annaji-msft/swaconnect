import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Providers, ProxyProvider, ProviderState} from '@microsoft/mgt';
import { Login } from '@microsoft/mgt-react';

let provider = new ProxyProvider("/api/proxy", async () => {
  return {
    "X-MS-TOKENPROVIDER-ID": 'graph',
    "X-MS-PROXY-BACKEND-HOST": 'https://graph.microsoft.com'
  };
});

provider.login = () => 
{ 
  provider.graph
      .api('me')
      .get()
      .then(
        user => {
          if (user != null) {
            provider.setState(ProviderState.SignedIn);
          } else {
            provider.setState(ProviderState.SignedOut);
          }
        },
        err => {
          provider.setState(ProviderState.SignedOut);
        }
      );
};

provider.logout = () => { 
  provider.setState(ProviderState.SignedIn); 
};

Providers.globalProvider = provider;

ReactDOM.render(
  <React.StrictMode>
    <Login />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
