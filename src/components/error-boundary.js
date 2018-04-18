import React from 'react'

import { logError } from 'api-call'
import { getCookie } from 'cookie'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidCatch(error, info) {
    if (!getCookie().impicklerick) {
      logError(error.stack, info.componentStack)
    }
  }

  render() {
    return this.props.children
  }
}

