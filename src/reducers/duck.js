

import React from 'react'

import * as ObjectUtil from 'util/object-util'

export default function(compiled_real_estate) {

  return function(NextComponent) {

    return class Duck extends React.Component {
      constructor(props) {
        super(props)

        this.bundle = (state) => {
          const pub = {}
          for (let key in reader) {
            pub[key] = (...args) => reader[key](...args)(this.state.private)
          }
          for (let key in writer) {
            pub[key] = this[key]
          }
          pub.reInit = this.reInit
          return {
            private:state,
            public:pub,
          }
        }

        this.bundleAndUpdate = (state) => this.setState(this.bundle(state))
        this.reInit = () => this.bundleAndUpdate(initial_state)

        for (let key in writer) {
          this[key] = (...args) => this.bundleAndUpdate(writer[key](...args)(this.state.private))
        }

        this.state = this.bundle(initial_state)
      }

      render() {
        const enhanced_props = ObjectUtil.compose(this.props,{[props_name]:this.state.public})
        return (
          <NextComponent {...enhanced_props}/>
        )
      }
    }
  }

}