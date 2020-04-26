// @flow
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../firebase';
import AuthUserContext from './Context';

const withAuthorization = (condition: Function) => (
  Component: React.AbstractComponent<Object>
) => {
  class WithAuthorization extends React.Component<Object> {
    listener: Function;

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push('/');
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }
    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }
  return compose(withRouter, withFirebase)(WithAuthorization);
};

export default withAuthorization;
