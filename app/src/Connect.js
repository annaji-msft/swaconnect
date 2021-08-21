import React from 'react';
import axios from 'axios';
import { DefaultButton, ThemeProvider, Stack, Label, TextField } from '@fluentui/react';  

class Connect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      token: ""
    };
  }

  componentDidMount() {
    axios.get(`/api/.token/status/${this.props.name}`)
      .then(response => {
        if(response && response === 'CONNECTED') {
          this.setState({ connected: true })
         }
      });
  }

  create = () => {
    axios.post(`/api/.token/create/${this.props.name}`)
    .then(() => {
      this.setState({ connected: true });
    }).catch((error) => {
      if (error.response
        && error.response.status === 401
        && error.response) {
        // Initiate consent flow with redirect url.
        window.location.replace(error.response);
      } else {
        alert(error);
      }
    });
  }

  delete = () => {
    axios.post(`/api/.token/delete/${this.props.name}`)
      .then(() => {
        this.setState({ connected: false });
      }).catch((error) => {
        alert(error);
      });
  }

  getToken = () => {
    axios.get(`/api/.token/${this.props.name}`)
    .then((token) => {
      this.setState({ token: token });
    }).catch((error) => {
      alert(error);
    });
  }

  render() { 
    return (<div>
      <ThemeProvider>
      <Label>{this.props.name} token: {this.state.connected} </Label>
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
             <TextField label="Non-resizable" multiline autoAdjustHeight value={this.state.token} />
       </ThemeProvider>
       </div>);
    }
  }

export default Connect;
