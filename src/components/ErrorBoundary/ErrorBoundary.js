// @flow
import * as React from 'react';

// Flow type
type Props = {
  children: React.Node
};

type State = {
  hasError: boolean
};

// Component App
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

    return hasError ? (
      <div className='error__banner'>
        <h1 className='error__text'>Что-то пошло не так.</h1>
      </div>
    ) : (
      children
    );
  }
}
