// @flow
import React from 'react';

import AuthUserContext from './Context';
import { withFirebase } from '../firebase';

/*
Если написать так, тогда некоторые ошибки в flow исчезнут, 
но появятся ошибки в браузере и приложение не будет работать.

type Props = Any;

const withAuthentication = 
<Props extends object>(Component:React.ComponentType<Props>) => {
*/

const withAuthentication = Component => {
  class WithAuthentication extends React.Component {
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
