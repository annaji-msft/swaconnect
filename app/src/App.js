import React from 'react';
import axios from 'axios';
import { 
  DefaultButton, 
  ThemeProvider, 
  initializeIcons, 
  Stack, 
  Label, 
  Text,
  Toggle,
  Separator} from '@fluentui/react';
import { createTheme } from '@fluentui/react/lib/Styling';

import Connect from './Connect';
import Proxy from './Proxy';
import Token from './Token';

const theme = createTheme({
  fonts: {
    medium: {
      fontFamily: 'Monaco, Menlo, Consolas',
      fontSize: '20px',
    },
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      identityProvider: undefined,
      showDocs: false
    };
    initializeIcons();
  }

  componentDidMount() {
    axios.post('/.auth/me')
      .then(userInfo => {
        if (userInfo && userInfo.data.clientPrincipal != null) {
          this.setState({ userId: userInfo.data.clientPrincipal.userDetails, identityProvider: userInfo.data.clientPrincipal.identityProvider })
        }
      })
  }

  documentationToggle = (ev, checked) => { this.setState({showDocs: checked}); };

  render() {
    return (<div>
      <header>
        <h3>#EasyTokens - Service integrations made simple!</h3>
        <Separator theme={theme}>Step 1: Login</Separator>
        <ThemeProvider>
          <Stack horizontal tokens={{
            childrenGap: 10,
            padding: 10,
          }}>
            <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/aad" disabled={this.state.userId !== undefined} >
              Microsoft
            </DefaultButton>
            <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/twitter" disabled={this.state.userId !== undefined} >
              Twitter
            </DefaultButton>
            <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/github" disabled={this.state.userId !== undefined} >
              Github
            </DefaultButton>
            <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/google" disabled={this.state.userId !== undefined} >
              Google
            </DefaultButton>
            <DefaultButton href="/.auth/logout" disabled={this.state.userId === undefined}>
              Logout
            </DefaultButton>
          </Stack>
          <Label>Token's will be stored and managed under logged in identity.</Label>
          <br />
          {this.state.userId !== undefined
            && <div>
              <Label>Hello, "{this.state.userId}". You are logged in using "{this.state.identityProvider}"</Label>
              <br />
            </div>}
          <br />
          {this.state.userId !== undefined
            && <div>
              <Separator theme={theme}>Step 2: Manage Tokens</Separator>
              <h4 style={{ color: 'red' }}>DO NOT USE YOUR PERSONAL ACCOUNTS FOR CREATING TOKENS. USE A TEST ACCOUNT (or) DELETE THE TOKEN AFTER TRIAL</h4>
              <Stack horizontal tokens={{
                childrenGap: 10,
                padding: 10,
              }}>
                <Connect name="graph" />
                <Separator vertical />
                <Connect name="dropbox" />
                <Separator vertical />
                <Connect name="google" />
                <Separator vertical />
              </Stack>
              <Separator theme={theme}>Option 1: Retrieve Token</Separator>
              <Stack horizontal tokens={{
                childrenGap: 10,
                padding: 10,
              }}>
                <Token name="graph" />
                <Separator vertical />
                <Token name="dropbox" />
                <Separator vertical />
                <Token name="google" />
                <Separator vertical />
              </Stack>
              <Separator theme={theme}>Option 2: Proxy with token attached</Separator>
              <Proxy />
              <Separator theme={theme}>Documentation</Separator>
            </div>}
        </ThemeProvider>
      </header>
    
      {this.state.userId !== undefined
        && <div>
          <Toggle onText="show" offText="hide" onChange={this.documentationToggle} />
        </div>
      }
      { this.state.showDocs === true &&
        <div>
        <h3><b>Programatically Managing Tokens: </b></h3>
        <Label>  Create Token     [Post] '/api/.token/create/#tokenproviderid#'</Label>
        <Label>      Example      [Post] '/api/.token/create/graph'</Label>
        <Label>  Delete Token     [Post] '/api/.token/delete/#tokenproviderid#'</Label>
        <Label>      Example      [Post] '/api/.token/delete/graph'</Label>
        <Label>  Token Status     [GET]  '/api/.token/status/#tokenproviderid#'</Label>
        <Label>      Example      [GET]  '/api/.token/status/graph'</Label>
        <Label>  Retrieve Token   [GET]  '/api/.token/#tokenproviderid#'</Label>
        <Label>      Example      [GET]  '/api/.token/graph'</Label>
        <br />
        <Text block>During the create, user is asked to consent through the standard oauth flow.</Text> 
        <Text block>Token is not created and saved until the consent is successful. Once the consent flow succeeds, token is now ready for use - "connected"</Text>
        <Text block>On status "connected". Token is successfully saved and refreshed periodically by the system to keep it alive.</Text>
        <h4>Don't like projecting token to the client's, got you covered ...</h4>
        <h3><b>Proxy by Attaching Token: </b></h3>
        <Label> [GET, PUT, POST, DELETE] '/api/proxy/#api-operation-path#' ; headers - [X-MS-TOKENPROVIDER-ID: #tokenproviderid#] and [X-MS-PROXY-BACKEND-HOST: #endpoint#]</Label>
        <Label> Example - [GET] '/api/proxy/me' ; headers - [X-MS-TOKENPROVIDER-ID: 'graph'] and [X-MS-PROXY-BACKEND-HOST: 'https://graph.microsoft.com/v1.0']</Label>
        </div>
      }
    </div>);
  }

}

export default App;
