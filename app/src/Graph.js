import React from 'react';
import axios from 'axios';
import { DefaultButton, ThemeProvider, Stack, Label } from '@fluentui/react';

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      token: ""
    };
  }

  componentDidMount() {
    axios.get('/api/.token/status/graph')
      .then(response => {
        if(response && response === 'CONNECTED') {
          this.setState({ connected: true })
         }
      });
  }

  create = () => {
    axios.post("/api/.token/create/graph")
    .then(() => {
      this.setState({ connected: true });
    }).catch((error) => {
      if (error.response
        && error.response.status === 401
        && error.response) {
        // Initiate consent flow with redirect url.
        window.location.href = error.response;
      } else {
        alert(error);
      }
    });
  }

  delete = () => {
    axios.post("/api/.token/delete/graph")
      .then(() => {
        this.setState({ connected: false });
      }).catch((error) => {
        alert(error);
      });
  }

  getToken = () => {
    axios.get("/api/.token/graph")
    .then((token) => {
      this.setState({ token: token });
    }).catch((error) => {
      alert(error);
    });
  }

  render() { 
    return (<div>
      <ThemeProvider>
      <Label>Graph Token</Label>
         <Stack verticalAlign tokens={{
               childrenGap: 5,
               padding: 5,
               maxWidth: "50px"
             }}>

               <DefaultButton iconProps={{ iconName: 'PlugConnected' }} onClick={this.create} disabled={this.state.connected === true} >
                 Create
               </DefaultButton>

               <DefaultButton iconProps={{ iconName: 'PlugDisconnected' }} onClick={this.delete}  disabled={this.state.connected === false}>
                 Delete
               </DefaultButton>

               <DefaultButton iconProps={{ iconName: 'AzureKeyVault' }} onClick={this.getToken}  disabled={this.state.connected === false} >
                 Display
               </DefaultButton>

             </Stack>

             <Label>{this.state.token}</Label>
       </ThemeProvider>
       </div>);
    }
  }

export default Graph;
