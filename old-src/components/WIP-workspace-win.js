import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'

import { setParentPath, sortByMaxRemainingPathLength } from 'reducers/database'
import { setNoFocus, unlock } from 'reducers/icicle-state'

import { getMaxRemainingPathLength } from 'table-tree'

import { tr } from 'dict'
import * as Color from 'color'

import Icicle from 'components/icicle'
import Ruler from 'components/ruler'
import BreadCrumbs from 'components/breadcrumbs'
import Report from 'components/report'
import BTRButton from 'components/back-to-root-button'

const chart_style = {
  stroke: '#fff',
}

const btr_style = {
  textAlign: 'center',
  padding: '1em 0'
}


class Presentational extends React.PureComponent {
  constructor(props) {
    super(props)

    props.sortByMaxRemainingPathLength()

  }

  render() {
    const max_path_len = 260
    const root_id_node = this.props.getByID(this.props.root_id)

    const max_children_path_len_root_id = root_id_node.get('max_children_path_length')

    const fWidth = id => {
      const node = this.props.getByID(id)

      return getMaxRemainingPathLength(node)
    }

    const normalizeWidth = arr => {
      arr = arr.map(a=>Math.pow(a,10))
      // arr = arr.map(a=>Math.exp(a))
      const sum = arr.reduce((a,b)=>a+b,0)
      const ans = arr.map(a=>a/sum)
      return ans
    }

    const trueFHeight = max_height => id => {
      const node = this.props.getByID(id)
      const len = node.get('name').length
      return len * (max_height/max_path_len)
    }

    const fillColor = id => {
      const node = this.props.getByID(id)
      const len = node.get('parent_path_length') + node.get('name').length
      const zero_to_one = len/max_children_path_len_root_id
      return Color.toRgba(Color.gradient([122, 255, 159, 1],[255, 121, 121, 1])(zero_to_one))
    }

    return (
      <div>
          <Report
            fillColor={fillColor}
          />
          <div className="grid-x">
            <div className="cell small-2"></div>
            <div className="cell small-4" style={btr_style}>
              <BTRButton />
            </div>
            <div className="cell small-6"></div>
          </div>
          <div className="grid-x">
            <div
              onClick={(e) => {this.props.unlock(); this.props.setNoFocus();}}
              className="cell small-8"
            >
              <Icicle
                fWidth={fWidth}
                normalizeWidth={normalizeWidth}
                trueFHeight={trueFHeight}
                fillColor={fillColor}
              />
              <Ruler
                fillColor={fillColor}
              />
            </div>
            <div className="cell small-4" style={chart_style}>
              <BreadCrumbs
                trueFHeight={trueFHeight}
                fillColor={fillColor}
              />
            </div>
          </div>
      </div>
    )
  }

}



const mapStateToProps = state => {
  const database = selectDatabase(state)
  const icicle_state = selectIcicleState(state)

  return {
    root_id: database.rootId(),
    max_depth: database.maxDepth(),
    getByID: database.getByID,
    display_root: icicle_state.display_root(),
  }
}
 
const mapDispatchToProps = dispatch => {
  return {
    setNoFocus: (...args) => dispatch((setNoFocus(...args))),
    unlock: (...args) => dispatch((unlock(...args))),
    setParentPath: (...args) => dispatch(setParentPath(...args)),
    sortByMaxRemainingPathLength: (...args) => dispatch(sortByMaxRemainingPathLength(...args))
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
