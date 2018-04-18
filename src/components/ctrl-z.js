import React from 'react'
import { connect } from 'react-redux'


import { undo, redo } from 'reducers/root-reducer'


class Presentational extends React.Component {
  constructor(props) {
    super(props)
    
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.nb_files === nextProps.nb_files) {
  //     return false
  //   }
  //   let cur_ms = (new Date()).getTime()
  //   if (cur_ms - this.last_ms < this.thres) {
  //     return false
  //   }
  //   this.last_ms = cur_ms
  //   return true
  // }

  render() {
    return (
      <div></div>
    )
  }
}

// const Presentational = props => {

//   return (
//     <div onKeyDown={e=>console.log(e)} onClick={e=>console.log(e)} style={{height:'0px'}}>

//     </div>
//   )
// }



const mapStateToProps = state => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    undo: () => dispatch(undo()),
    redo: () => dispatch(redo())
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
