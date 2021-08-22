import React from 'react';
import axios from 'axios';
import {ThemeProvider, Stack, Label, TextField, PrimaryButton, DefaultButton } from '@fluentui/react';  

class Token extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: ""
    };
  }

  getToken = () => {
    axios.get(`/api/.token/status/${this.props.name}`)
    .then(response => {
      if(response && response.data === 'CONNECTED') {
        axios.post(`/api/.token/${this.props.name}`)
        .then((token) => {
          this.setState({ token: token });
        }).catch((error) => {
          console.log(error);
        });
       }
    }).catch((error) => {
      console.log(error);
    });
  }

  clear = () => {
    this.setState({ token: "" });
  }

  render() { 
    return (<div>
      <ThemeProvider>
      <Label>{this.props.name} token</Label>
         <Stack verticalAlign tokens={{
               childrenGap: "l2",
               padding: "l2"
             }}>
               <PrimaryButton iconProps={{ iconName: 'AzureKeyVault' }} onClick={this.getToken} >
                 Display
               </PrimaryButton>
               <DefaultButton iconProps={{ iconName: 'Cancel' }} onClick={this.clear} >
                 Clear
               </DefaultButton>
             </Stack>
             <TextField label="Token" multiline resizable={true} value={this.state.token.data} />
       </ThemeProvider>
       </div>);
    }
  }

export default Token;
