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
  Separator
} from '@fluentui/react';
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
      showGetToken: true,
      showProxy: true
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

  tokenSectionToggle = (ev, checked) => { this.setState({ showGetToken: checked }); };

  proxySectionToggle = (ev, checked) => { this.setState({ showProxy: checked }); };

  render() {
    return (<div>
      <ThemeProvider>
        <header>
          <Label theme={theme}>EasyTokens</Label>
          <Separator theme={theme}>Step 1: Login</Separator>
          <Stack reversed horizontal tokens={{
            childrenGap: "l1",
            padding: "l1",
          }}>
            <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/google" disabled={this.state.userId !== undefined} >
              Google
            </DefaultButton>
            <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/github" disabled={this.state.userId !== undefined} >
              Github
            </DefaultButton>
            <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/twitter" disabled={this.state.userId !== undefined} >
              Twitter
            </DefaultButton>
            <DefaultButton iconProps={{ iconName: 'AuthenticatorApp' }} href="/.auth/login/aad" disabled={this.state.userId !== undefined} >
              Microsoft
            </DefaultButton>
            <DefaultButton href="/.auth/logout" disabled={this.state.userId === undefined}>
              Logout
            </DefaultButton>
            {this.state.userId === undefined
            && <div>
              <Label>Hello, "{this.state.userId}". You are logged in using "{this.state.identityProvider}".</Label>
              <Label>Token's are managed under logged in identity by the system.</Label>
              <br />
            </div>}
          </Stack>
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
            </div>}
        </header>
        <br />
        {this.state.userId !== undefined
          && <div>
            <Separator theme={theme}>Option 1: Proxy</Separator>
            <Toggle defaultChecked onText="show" offText="hide" onChange={this.proxySectionToggle} />
            <Text>Token gets attached before calling the backend. User's cannot get hold of token on the client-side.</Text>
          </div>
        }
        {this.state.userId !== undefined && this.state.showProxy === true
          && <div>
            <Proxy />
          </div>}

        <br />
        {this.state.userId !== undefined
          && <div>
            <Separator theme={theme}>Option 2: Retrieve Token</Separator>
            <Toggle defaultChecked onText="show" offText="hide" onChange={this.tokenSectionToggle} />
            <Text>Just give me the token! It's ok if the user get's hold of token's that they have access to.</Text>
          </div>
        }

        { this.state.userId !== undefined && this.state.showGetToken === true
          && <div>
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
          </div>}
      </ThemeProvider>
    </div>);
  }
}

export default App;
