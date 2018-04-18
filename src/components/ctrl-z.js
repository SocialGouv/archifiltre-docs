import React from 'react'
import { connect } from 'react-redux'


import { undo, redo } from 'reducers/root-reducer'


const Presentational = props => {

  return (
    <div onKeyDown={e=>console.log(e)} onClick={e=>console.log(e)} style={{height:'0px'}}>

    </div>
  )
}



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
