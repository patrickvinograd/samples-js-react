/*
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

export default withAuth(class Appeals extends Component {
  constructor(props) {
    super(props);
    this.state = { appeals: null, failed: null };
  }

  componentDidMount() {
    this.getAppeals();
  }

  async getAppeals() {
    if (!this.state.appeals) {
      try {
        const accessToken = await this.props.auth.getAccessToken();
        /* global fetch */
        const response = await fetch(config.resourceServer.appealsUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'X-VA-User': 'Call Center Rep'
          },
        });

        if (response.status === 404) {
          this.setState({ failed: false, appeals: ["You have no appeals on record."] });
          return;
        }
        if (response.status !== 200) {
          this.setState({ failed: true });
          return;
        }

        const data = await response.json();  
        console.log(data);
        console.log(JSON.stringify(data));
        this.setState({ appeals: data, failed: false });
      } catch (err) {
        this.setState({ failed: true });
        /* eslint-disable no-console */
        console.error(err);
      }
    }
  }

  render() {
    const possibleErrors = [
      'Your Open ID Connect-enabled vets-api instance is running at ' + config.resourceServer.appealsUrl,
    ];
    const divStyle = {
      border: '2px solid #118762',
      backgroundColor: '#CDECDB',
      padding: '20px'
    }
    return (
      <div>
        <Header as="h1">My Appeals</Header>
        {this.state.failed === true && <Message error header="Failed to fetch appeals.  Please verify the following:" list={possibleErrors} />}
        {this.state.failed === null && <p>Fetching Appeals..</p>}
        {this.state.appeals &&
          <div>
            <p>You have granted this application access to your VA appeals data. It can now
               use an access token to retrieve and display your appeals.</p>
            <div style={divStyle}>
            <JSONPretty id="json-pretty" json={this.state.appeals}/>
            </div>
          </div>
        }
      </div>
    );
  }
});
