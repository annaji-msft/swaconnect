import React from 'react';
import axios from 'axios';
import { Dropdown, TextField, PrimaryButton, ThemeProvider, Stack, Pivot, PivotItem, Separator} from '@fluentui/react'; 

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
            headers : JSON.parse(this.state.headers),
            data: JSON.parse(this.state.body)
        }).then((response) => {
            this.setState({response: JSON.stringify(response.data)});
        }).catch((error) => {
            this.setState({response: error});
        });
       };

      render() { 
        return (<div>
          <ThemeProvider>
          <Separator>Request</Separator>
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
            <Pivot>
                <PivotItem headerText="Headers">
                    <TextField defaultValue={defaultHeaders} multiline onChange={this.headersChange} width="300"/>
                </PivotItem>
                <PivotItem headerText="Body">
                    <TextField height="300" multiline onChange={this.bodyChange} width="300"/>
                </PivotItem>
            </Pivot>
            <Separator>Response</Separator>
            <Pivot>
                <PivotItem headerText="Body">
                    <TextField label="Response Body" readOnly multiline value={this.state.response} width="100"/>
                </PivotItem>
            </Pivot>
            <br />
            <PrimaryButton text="Send Request" label="Send" onClick={this.sendRequest} />
          </ThemeProvider>
          </div>)
      }
 }

export default Proxy;

