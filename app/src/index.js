import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Providers, ProxyProvider} from '@microsoft/mgt-react';

let provider = new ProxyProvider("/api/proxy", async () => {
  return {
    "X-MS-TOKENPROVIDER-ID": 'graph',
    "X-MS-PROXY-BACKEND-HOST": 'https://graph.microsoft.com/v1.0'
  };
});

provider.login = () => { /* will be called when "Sign In" is clicked */ };
provider.logout = () => { /* will be called when "Sign Out" is called */ };

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
