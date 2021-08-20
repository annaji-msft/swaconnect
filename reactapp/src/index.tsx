import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Providers, ProviderState } from '@microsoft/mgt-element';
import { ProxyProvider } from '@microsoft/mgt-proxy-provider';

let provider = new ProxyProvider("/api/proxy", async () => {
  return {
    "X-MS-TOKENPROVIDER-ID": 'graph',
    "X-MS-PROXY-BACKEND-HOST": 'https://graph.microsoft.com'
  };
});

provider.login = async  () => { 
  return provider.graph
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

provider.logout = async  () => { 
  
};


Providers.globalProvider = provider;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
