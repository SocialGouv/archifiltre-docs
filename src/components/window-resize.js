
import React from 'react'

import * as UserData from 'user-data'

const { remote } = require('electron')

class WindowResize extends React.PureComponent {
  constructor(props) {
    super(props)

    const {reader,writer} = UserData.create({
      width:620,
      height:600,
    })

    this.state = {
      win:remote.getCurrentWindow(),
      reader,
      writer,
    }

    this.onResize = this.onResize.bind(this)
  }

  onResize() {
    const state = this.state
    const win = state.win
    const writer = state.writer

    const [width,height] = win.getSize()

    writer({
      width,
      height,
    })
  }

  componentDidMount() {
    const state = this.state
    const win = state.win
    const reader = state.reader

    const {width,height} = reader()

    win.setSize(width,height)

    win.show()

    const onResize = this.onResize
    window.addEventListener('resize',onResize)
  }

  componentWillUnmount() {
    const onResize = this.onResize
    window.removeEventListener('resize',onResize)
  }

  componentDidCatch(error, info) {
    console.log(error,info)
  }

  render() {

    return null
  }
}

export default class WindowResizeErrorHandler extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false
    }
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true
    })
  }

  render() {
    const props = this.props
    const state = this.state

    if (state.hasError) {
      remote.getCurrentWindow().show()
      return null
    } else {
      return <WindowResize/>
    }
  }
}

