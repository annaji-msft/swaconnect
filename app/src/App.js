import React from 'react';
import axios from 'axios';
import { DefaultButton, ThemeProvider, initializeIcons, Stack, Label } from '@fluentui/react';

import Graph from './Graph'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      identityProvider: undefined
    };
    initializeIcons();
  }

  componentDidMount() {
    axios.post('/.auth/me')
      .then(userInfo => {
        if(userInfo && userInfo.data.clientPrincipal != null) {
          this.setState({ userId: userInfo.data.clientPrincipal.userDetails, identityProvider: userInfo.data.clientPrincipal.identityProvider })
         }
      })
  }

  render() { 
    return (<div>
      <header>
      <ThemeProvider>
         <Stack horizontal tokens={{
               childrenGap: 10,
               padding: 10,
             }}>
               <Label>To get started, please login with one of the authentication providers!</Label>
               <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/aad" disabled={this.state.userId !== undefined} >
                 Login with Microsoft
               </DefaultButton>
               <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/twitter" disabled={this.state.userId !== undefined} >
                 Login with Twitter
               </DefaultButton>
               <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/github" disabled={this.state.userId !== undefined} >
                 Login with Github
               </DefaultButton>
               <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/google" disabled={this.state.userId !== undefined} >
                 Login with Google
               </DefaultButton>
               <DefaultButton href="/.auth/logout" disabled={this.state.userId === undefined}>
                 Logout
             </DefaultButton>
             </Stack>
             <Label>Hello, "{this.state.userId}". You are logged in using "{this.state.identityProvider}"  Let's connect to some services ...</Label>
             <br />
             <br />
             {this.state.userId !== undefined 
             && <Graph />}
       </ThemeProvider>
       </header>
       </div>);
   }

  }

export default App;
