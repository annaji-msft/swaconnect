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
  Separator,
  Spinner
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
      showProxy: true,
      showDocs: false,
      supportedTokenProviders: undefined
    };
    initializeIcons();
  }

  componentDidMount() {
    axios.post('/.auth/me')
      .then(userInfo => {
        if (userInfo && userInfo.data.clientPrincipal != null) {
          this.setState({ userId: userInfo.data.clientPrincipal.userDetails, identityProvider: userInfo.data.clientPrincipal.identityProvider })
        }

        axios.get('/api/.token/providers')
          .then(response => {
            this.setState({ supportedTokenProviders: response.data })
          });
      })
  }

  tokenSectionToggle = (ev, checked) => { this.setState({ showGetToken: checked }); };

  proxySectionToggle = (ev, checked) => { this.setState({ showProxy: checked }); };

  docsToggle = (ev, checked) => { this.setState({ showDocs: checked }); };

  render() {
    return (<div>
      <ThemeProvider>
        <header>
          <Label theme={theme}>EasyTokens</Label>
          <Separator theme={theme}>Step 1: Login</Separator>
          {this.state.userId !== undefined
            && <div>
              <Stack reversed horizontal tokens={{
                childrenGap: "l1",
                padding: "l1",
              }}>
                <DefaultButton href="/.auth/logout" disabled={this.state.userId === undefined}>
                  Logout
                </DefaultButton>
                <Label>Hello, "{this.state.userId}". You are logged in using "{this.state.identityProvider}". Token's are managed under logged in identity.</Label>
              </Stack>
              <br />
            </div>}
          {this.state.userId === undefined
            && <div>
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
                <Label>Please login to get started! Token's are managed under logged in identity.</Label>
              </Stack>
              <br />
            </div>}
          <br />
        </header>
        <br />
        {this.state.supportedTokenProviders === undefined
          && <Spinner size={SpinnerSize.large} />
        }
        {this.state.userId !== undefined && this.state.supportedTokenProviders !== undefined
          && <div>
            <Separator theme={theme}>Step 2: Manage Tokens</Separator>
            <h4 style={{ color: 'red' }}>DO NOT USE YOUR PERSONAL ACCOUNTS FOR CREATING TOKENS. USE A TEST ACCOUNT (or) DELETE THE TOKEN AFTER TRIAL</h4>
            <Stack horizontal horizontalAlign="center" tokens={{
              childrenGap: 10,
              padding: 10,
            }}>
              {this.state.supportedTokenProviders.map((item) => {
                return <div>
                  <Connect name={item} />
                  <Separator vertical />
                </div>
              })}
            </Stack>
          </div>}
        {this.state.userId !== undefined && this.state.supportedTokenProviders !== undefined
          && <div>
            <Separator theme={theme}>Option 1: Proxy</Separator>
            <Stack horizontal horizontalAlign="center" tokens={{
              childrenGap: 10,
              padding: 10,
            }}>
              <Toggle defaultChecked onText="show" offText="hide" onChange={this.proxySectionToggle} />
              <Label>Token gets attached before calling the backend. User's cannot get hold of token on the client-side.</Label>
            </Stack>
          </div>
        }
        {this.state.userId !== undefined && this.state.showProxy === true && this.state.supportedTokenProviders !== undefined
          && <div>
            <Proxy />
          </div>}

        <br />
        {this.state.userId !== undefined && this.state.supportedTokenProviders !== undefined
          && <div>
            <Separator theme={theme}>Option 2: Retrieve Token</Separator>
            <Stack horizontal horizontalAlign="center" tokens={{
              childrenGap: 10,
              padding: 10,
            }}>
              <Toggle defaultChecked onText="show" offText="hide" onChange={this.tokenSectionToggle} />
              <Label>Just give me the token! It's ok if the user get's hold of token's that they have access to.</Label>
            </Stack>
          </div>
        }

        {this.state.userId !== undefined && this.state.showGetToken === true && this.state.supportedTokenProviders !== undefined
          && <div>
            <Stack horizontal horizontalAlign="center" tokens={{
              childrenGap: 10,
              padding: 10,
            }}>
              {this.state.supportedTokenProviders.map((item) => {
                return <div>
                  <Token name={item} />
                  <Separator vertical />
                </div>
              })}
            </Stack>
          </div>}

        <br />
        {this.state.userId !== undefined && this.state.supportedTokenProviders !== undefined
          && <div>
            <Separator theme={theme}>Documentation</Separator>
            <Stack horizontal horizontalAlign="center" tokens={{
              childrenGap: 10,
              padding: 10,
            }}>
              <Toggle onText="show" offText="hide" onChange={this.docsToggle} />
              <Label>How does this work?</Label>
            </Stack>
          </div>
        }

        {this.state.showDocs === true &&
          <div>
            <br />
            <Label>Curently Supported Token Providers:</Label>
            <Text>{this.state.supportedTokenProviders.join()}</Text>
            <br />
            <br />
            <Label>Programatically Manage Tokens in Static Web Apps:</Label>
            <Text>List Token Providers  [POST] '/api/.token/providers</Text>
            <br />
            <Text>Create Token     [POST] '/api/.token/create/#tokenproviderid#'</Text>
            <br />
            <Text>Delete Token     [POST] '/api/.token/delete/#tokenproviderid#'</Text>
            <br />
            <Text>Token Status     [GET]  '/api/.token/status/#tokenproviderid#'</Text>
            <br />
            <br />
            <Label>Token's can be used in two ways,</Label>
            <Label>Option 1: Get Token</Label>
            <Text>Retrieve Token   [POST]  '/api/.token/#tokenproviderid#'</Text>
            <br />
            <Label>Option 2: Proxy</Label>
            <Text>[GET, PUT, POST, PATCH, DELETE] '/api/proxy/#api-operation-path#'</Text>
            <br />
            <Text>Required Headers - [X-MS-TOKENPROVIDER-ID: #tokenproviderid#] and [X-MS-PROXY-BACKEND-HOST: #endpoint#]</Text>
            <br />
            <br />
            <Label>Example: Graph</Label>
            <Text>Create Token     [POST] '/api/.token/create/graph'</Text>
            <br />
            <Text>Delete Token     [Post] '/api/.token/delete/graph'</Text>
            <br />
            <Text>Token Status     [GET]  '/api/.token/status/graph'</Text>
            <br />
            <Text>Retrieve Token   [GET]  '/api/.token/graph'</Text>
            <br />
            <Text>Proxy [GET] '/api/proxy/me'; Headers - [X-MS-TOKENPROVIDER-ID:"graph"] and [X-MS-PROXY-BACKEND-HOST:"https://graph.microsoft.com/v1.0"]</Text>
            <br />
          </div>
        }
      </ThemeProvider>
    </div>);
  }
}

export default App;
