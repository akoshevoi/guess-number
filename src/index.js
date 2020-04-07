// @flow
import React from 'react';
import ReactDOM from 'react-dom';

import EnterNum from './containers/EnterNum';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(
  <Router>
    <EnterNum />
  </Router>, // $FlowIgnore
  document.getElementById('root'));
