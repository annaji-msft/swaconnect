import React from 'react';
import axios from 'axios';
import { Dropdown, TextField, PrimaryButton, ThemeProvider, Label, Stack} from '@fluentui/react'; 
import { useState } from 'react';


const dropdownStyles = {
    dropdown: { width: 100 }
  };

const httpMethods = [
    { key: 'GET', text: 'GET' },
    { key: 'POST', text: 'POST' },
    { key: 'PUT', text: 'PUT' },
    { key: 'PATCH', text: 'PATCH' },
    { key: 'DELETE', text: 'DELETE' },
  ];

class Proxy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          method: "GET",
          headers: `{'X-MS-TOKENPROVIDER-ID':'graph','X-MS-PROXY-BACKEND-HOST':'https://graph.microsoft.com/v1.0'}`,
          apiOperation: "me",
          body: "",
          response: ""
        };
      }

      methodChanged = (ev, option) => { this.setState({method: option.text}); };

      operationChange = (ev, text) => { this.setState({apiOperation: text}); };

      headersChange = (ev, text) => { this.setState({headers: text}); };

      bodyChange = (ev, text) => { this.setState({body : text}); };

      sendRequest = () => { 
        axios.request({
            url: `/api/proxy/${this.state.apiOperation}`,
            method: this.state.method,
            headers : JSON.parse(this.state.headers)
        }).then((response) => {
            this.setState({response: response});
        }).catch((error) => {
            this.setState({response: error});
        });
       };

      render() { 
        return (<div>
          <ThemeProvider>
          <Label>Proxy with token attached</Label>
          <Stack horizontal tokens={{
               childrenGap: "5",
               padding: "5",
             }}>
             <Dropdown label="Method" onChange={this.methodChanged} options={httpMethods} styles={dropdownStyles} defaultSelectedKey="GET" />
             <TextField defaultValue="me" label="API Operation" onChange={this.operationChange} width="300"/>
            </Stack>
            <Stack horizontal tokens={{
               childrenGap: "5",
               padding: "5",
             }}>
            </Stack>
            <TextField label="Headers" defaultValue="{'X-MS-TOKENPROVIDER-ID':'graph','X-MS-PROXY-BACKEND-HOST':'https://graph.microsoft.com/v1.0'}" multiline onChange={this.headersChange} width="300"/>
            <TextField label="Request Body" height="300" multiline onChange={this.bodyChange} width="300"/>
            <TextField label="Response Body" multiline value={this.state.response} width="100"/>
            <PrimaryButton text="Send" label="Send" onClick={this.sendRequest} />
          </ThemeProvider>
          </div>)
      }
 }

export default Proxy;
