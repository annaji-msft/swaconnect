import React from 'react';
import { DefaultButton, ThemeProvider, initializeIcons } from '@fluentui/react';

initializeIcons();

function App() {
  const value = 'World';
  return (<div>Hello {value}<a className="App-link" href="/login"> Login with Google </a><a className="App-link" href="/logout"> Logout</a>
   <ThemeProvider>
      <DefaultButton onClick={() => alert('hello')}>Hello World</DefaultButton>
    </ThemeProvider></div>);
}

export default App;
