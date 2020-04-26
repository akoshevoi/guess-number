// @flow
import * as React from 'react';
import { withFirebase } from '../firebase';
import AuthUserContext from './Context';

const withAuthentication = (Component: React.AbstractComponent<Object>) => {
  class WithAuthentication extends React.Component<
    Object,
    { authUser: Object | null }
  > {
    listener: Function;

    constructor(props) {
      super(props);
      this.state = {
        authUser: null
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      });
    }

    componentWillUnmount() {
      this.listener();
    }
    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }
  return withFirebase(WithAuthentication);
};

export default withAuthentication;
