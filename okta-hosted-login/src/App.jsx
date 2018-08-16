/*
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Security, SecureRoute, ImplicitCallback } from '@patrickvinograd/okta-react';
import { Container } from 'semantic-ui-react';
import config from './.samples.config';
import Home from './Home';
import ServiceHistory from './ServiceHistory';
import Appeals from './Appeals';
import Navbar from './Navbar';
import Profile from './Profile';

class App extends Component {
  render() {
    return (
      <Router>
        <Security
          issuer={config.oidc.issuer}
          client_id={config.oidc.clientId}
          redirect_uri={config.oidc.redirectUri}
          scope={config.oidc.scope}
          idp={config.oidc.idp}
        >
          <Navbar />
          <Container text style={{ marginTop: '7em' }}>
            <Route path="/" exact component={Home} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
            <SecureRoute path="/servicehistory" component={ServiceHistory} />
            <SecureRoute path="/appeals" component={Appeals} />
            <SecureRoute path="/profile" component={Profile} />
          </Container>
        </Security>
      </Router>
    );
  }
}

export default App;
