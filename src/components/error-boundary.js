import React from 'react'

import { logError } from 'api-call'
import { getCookie } from 'cookie'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    // this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    // this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    if (!getCookie().impicklerick) {
      logError(error.stack, info.componentStack)
    }
    // logErrorToMyService(error, info)
  }

  render() {
    // if (this.state.hasError) {
    //   // You can render any custom fallback UI
    //   return <h1>Something went wrong.</h1>;
    // }
    return this.props.children
  }
}

