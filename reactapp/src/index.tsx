import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Providers } from '@microsoft/mgt-element';
import { ProxyProvider } from '@microsoft/mgt-proxy-provider';

Providers.globalProvider = new ProxyProvider("/api/proxy", async () => {
  return {
    "X-MS-TOKENPROVIDER-ID": 'graph',
    "X-MS-PROXY-BACKEND-HOST": 'https://graph.microsoft.com'
  };
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
