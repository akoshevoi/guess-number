// @flow
import * as React from 'react';

const FirebaseContext = React.createContext<Object>({});

export const withFirebase = (Component: React.AbstractComponent<Object>) => (
  props: Object
) => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
);

export default FirebaseContext;
