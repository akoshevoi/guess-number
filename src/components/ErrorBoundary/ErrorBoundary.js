// @flow
import * as React from 'react';

type Props = {
  children: React.Node
};

type State = {
  hasError: boolean
};

export default class ErrorBoundary extends React.PureComponent<Props, State> {
  static defaultProps = {
    children: null
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  state = { hasError: false };

  render() {
    const { children } = this.props;
    const { hasError } = this.state;

    return hasError ? <h1>Что-то пошло не так.</h1> : children;
  }
}
