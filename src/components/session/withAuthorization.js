// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './Context';
import { withFirebase } from '../firebase';

/*
Если написать так, тогда некоторые ошибки в flow исчезнут, 
но появятся ошибки в браузере и приложение не будет работать.

type Props = Any;

const withAuthorization = (condition: boolean) => 
<Props extends object>(Component:React.ComponentType<Props>) => {
*/

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
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
