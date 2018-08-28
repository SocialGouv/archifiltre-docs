

import React from 'react'
import root_reducer from 'reducers/root-reducer'

function makeStore(compiled_real_estate) {
  const initialState = compiled_real_estate.initialState
  const flat_api = flattenApi(compiled_real_estate.api)
  const writer_key = []
  const reader_key = []

  for (let key in flat_api) {
    if (flat_api[key].reader) {
      reader_key.push(key)
    }
    if (flat_api[key].writer) {
      writer_key.push(key)
    }
  }

  return function(NextComponent) {

    return class Store extends React.Component {
      constructor(props) {
        super(props)

        this.state = initialState()

        // this.reader_api = {}
        // reader_key.forEach(key=>{
        //   this.reader_api[key] = (...args) => flat_api[key](...args)(this.state)
        // })

        this.writer_api = {}
        writer_key.forEach(key=>{
          this.writer_api[key] = (...args) => this.setState(flat_api[key](...args))
        })

        this.getApi = () => {
          const ans = {}
          reader_key.forEach(key=>{
            // ans[key] = this.reader_api[key]
            ans[key] = (...args) => flat_api[key](...args)(this.state)
          })
          writer_key.forEach(key=>{
            ans[key] = this.writer_api[key]
          })
          return unflattenApi(ans)
        }
      }

      render() {
        return (
          <NextComponent {...this.props} api={this.getApi()}/>
        )
      }
    }
  }

}

const flattenApi = (api) => {
  const flat_api = {}
  for (let key1 in api) {
    for (let key2 in api[key1]) {
      flat_api[key1+'|'+key2] = api[key1][key2]
    }
  }
  return flat_api
}

const unflattenApi = (flat_api) => {
  const api = {}
  for (let key in flat_api) {
    const split = key.split('|')
    if (api[split[0]] === undefined) {
      api[split[0]] = {}
    }
    api[split[0]][split[1]] = flat_api[key]
  }
  return api
}


export default makeStore(root_reducer)