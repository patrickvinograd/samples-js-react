/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { withAuth } from '@okta/okta-react';
import React, { Component } from 'react';
import { Header, Message } from 'semantic-ui-react';
import JSONPretty from 'react-json-pretty';
import config from './.samples.config';
import 'react-json-pretty/JSONPretty.monikai.styl';
require('react-json-pretty/JSONPretty.adventure_time.styl');

export default withAuth(class ServiceHistory extends Component {
  constructor(props) {
    super(props);
    this.state = { history: null, failed: null };
  }

  componentDidMount() {
    this.getServiceHistory();
  }

  async getServiceHistory() {
    if (!this.state.history) {
      try {
        const accessToken = await this.props.auth.getAccessToken();
        /* global fetch */
        const response = await fetch(config.resourceServer.serviceHistoryUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status !== 200) {
          this.setState({ failed: true });
          return;
        }

        const data = await response.json();  
        console.log(data);
        console.log(JSON.stringify(data));
/*        const messages = data.messages.map((message) => {
          const date = new Date(message.date);
          const day = date.toLocaleDateString();
          const time = date.toLocaleTimeString();
          index += 1;
          return {
            date: `${day} ${time}`,
            text: message.text,
            id: `message-${index}`,
          };
        });
*/
      this.setState({ history: data, failed: false });
      } catch (err) {
        this.setState({ failed: true });
        /* eslint-disable no-console */
        console.error(err);
      }
    }
  }

  render() {
    const possibleErrors = [
      'Your Open ID Connect-enabled vets-api instance is running on localhost:3000.',
    ];
    const divStyle = {
      border: '2px solid #118762',
      backgroundColor: '#CDECDB',
      padding: '20px'
    }
    return (
      <div>
        <Header as="h1">My Service History</Header>
        {this.state.failed === true && <Message error header="Failed to fetch service history.  Please verify the following:" list={possibleErrors} />}
        {this.state.failed === null && <p>Fetching Service History..</p>}
        {this.state.history &&
          <div>
            <p>This component makes a GET request to the resource server example, which must be running at <code>localhost:3000/services/veteran_verification/v0/service_history</code> (eventually dev-api.vets.gov once merged)</p>
            <p>
              It attaches your current access token in the <code>Authorization</code> header on the request,
              and the resource server will attempt to authenticate this access token.
              If the token is valid the server will return your service history.  If the token is not valid
              or the resource server is incorrectly configured, you will see a 401 <code>Unauthorized response</code>.
            </p>
            <p>
              This route is protected with the <code>&lt;SecureRoute&gt;</code> component, which will
              ensure that this page cannot be accessed until you have authenticated and have an access token in local storage.
            </p>
            <div style={divStyle}>
            <JSONPretty id="json-pretty" json={this.state.history}/>
            </div>
          </div>
        }
      </div>
    );
  }
});
