// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import Firebase, { FirebaseContext } from './components/firebase';
import App from './containers/App';

ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <App />
  </FirebaseContext.Provider>, // $FlowIgnore
  document.getElementById('root')
);
