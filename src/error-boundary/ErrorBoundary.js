// @flow
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error">
          <div className="error-banner"></div>
          <div className="error-text">Take it easy. It's just a error.</div>
        </div>
      );
    }

    return this.props.children;
  }
}
