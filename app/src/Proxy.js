import React from 'react';
import axios from 'axios';
import { Dropdown, TextField, PrimaryButton, ThemeProvider, Stack} from '@fluentui/react'; 

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

const defaultMethod = "GET";
const defaultHeaders = `{"X-MS-TOKENPROVIDER-ID":"graph","X-MS-PROXY-BACKEND-HOST":"https://graph.microsoft.com/v1.0"}`;
const defaultApiOperation = "me";

class Proxy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          method: defaultMethod,
          headers: defaultHeaders,
          apiOperation: defaultApiOperation,
          body: undefined,
          response: undefined
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
            this.setState({response: JSON.stringify(response.data)});
        }).catch((error) => {
            this.setState({response: error});
        });
       };

      render() { 
        return (<div>
          <ThemeProvider>
          <Stack horizontal tokens={{
               childrenGap: "5",
               padding: "5",
             }}>
             <Dropdown label="Method" defaultSelectedKey={defaultMethod} onChange={this.methodChanged} options={httpMethods} styles={dropdownStyles} />
             <TextField label="API Operation" defaultValue={defaultApiOperation}  onChange={this.operationChange} width="300"/>
            </Stack>
            <Stack horizontal tokens={{
               childrenGap: "5",
               padding: "5",
             }}>
            </Stack>
            <TextField label="Headers" defaultValue={defaultHeaders} multiline onChange={this.headersChange} width="300"/>
            <TextField label="Request Body" height="300" multiline onChange={this.bodyChange} width="300"/>
            <TextField label="Response Body" multiline value={this.state.response} width="100"/>
            <br />
            <PrimaryButton text="Send Request" label="Send" onClick={this.sendRequest} />
          </ThemeProvider>
          </div>)
      }
 }

export default Proxy;

