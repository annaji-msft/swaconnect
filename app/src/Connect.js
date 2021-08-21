import React from 'react';
import axios from 'axios';
import { DefaultButton, ThemeProvider, Stack, Label, TextField } from '@fluentui/react';  

class Connect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      token: "",
      status: ""
    };
  }

  componentDidMount() {
    axios.get(`/api/.token/status/${this.props.name}`)
      .then(response => {

        if(response && response.data !== undefined) {
          this.setState({ status: response.data })
        }

        if(response && response.data === 'CONNECTED') {
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
        window.location.replace(error.response.data);
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

  status = () => {
    axios.get(`/api/.token/status/${this.props.name}`)
      .then((response) => {
        this.setState({ status: response.data });
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
      <Label>{this.props.name} token </Label>
         <Stack verticalAlign tokens={{
               childrenGap: "l2",
               padding: "l2"
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
             <TextField label="Token" multiline resizable={false} value={this.state.token.data} />
       </ThemeProvider>
       </div>);
    }
  }

export default Connect;
