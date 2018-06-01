import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'

import { setParentPath } from 'reducers/database'
import { setNoFocus, unlock } from 'reducers/icicle-state'

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


const icicle_width = 800
const icicle_height = 300


class Presentational extends React.PureComponent {
  constructor(props) {
    super(props)

    this.fWidth = this.fWidth.bind(this)
    this.normalizeWidth = this.normalizeWidth.bind(this)
    this.trueFHeight = this.trueFHeight.bind(this)
    this.fillColor = this.fillColor.bind(this)
  }

  fWidth(id) {
    const node = this.props.getByID(id)
    return node.get('content').get('size')
  }

  normalizeWidth(arr) {
    const sum = arr.reduce((a,b)=>a+b,0)
    const ans = arr.map(a=>a/sum)
    return ans
  }

  trueFHeight(id) {
    return icicle_height/this.props.max_depth
  }

  fillColor(id) {
    const root_node = this.props.getByID(this.props.root_id)
    const last_modified = root_node.get('content').get('last_modified')
    const max_time = last_modified.get('max')
    const min_time = last_modified.get('min')
    const zeroToOne = (id) => {
      const node = this.props.getByID(id)
      const last_modified = node.get('content').get('last_modified')
      const time = last_modified.get('average')
      return (time - min_time) / (max_time - min_time)
    }

    return Color.toRgba(
      Color.gradiant(
        Color.leastRecentDate(),
        Color.mostRecentDate()
      )(zeroToOne(id))
    )


    const node = this.props.getByID(id)
    const name = node.get('name')

    if (node.get('children').size) {
      if (this.props.display_root.includes(id)) {
        return Color.parentFolder()
      } else {
        return Color.folder()
      }
    } else {
      return Color.fromFileName(name)
    }
  }


  render() {
    return (
      <div>
        <Report
          fillColor={this.fillColor}
        />
        <div className="grid-x grid-frame">
          <div className="cell small-2"></div>
          <div className="cell small-4" style={btr_style}>
            <BTRButton />
          </div>
          <div className="cell small-6"></div>
        </div>
        <div className="grid-x grid-frame">
          <div
            onClick={(e) => {this.props.unlock(); this.props.setNoFocus();}}
            className="cell small-8"
          >
            <Icicle
              icicle_width={icicle_width}
              icicle_height={icicle_height}
              fWidth={this.fWidth}
              normalizeWidth={this.normalizeWidth}
              trueFHeight={this.trueFHeight}
              fillColor={this.fillColor}
            />
            <Ruler
              icicle_width={icicle_width}
              fillColor={this.fillColor}
            />
          </div>
          <div className="cell small-4" style={chart_style}>
            <BreadCrumbs
              icicle_height={icicle_height}
              trueFHeight={this.trueFHeight}
              fillColor={this.fillColor}
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
    max_depth: database.maxDepth(),
    getByID: database.getByID,
    display_root: icicle_state.display_root(),
    root_id: database.rootId(),
  }
}
 
const mapDispatchToProps = dispatch => {
  return {
    setNoFocus: (...args) => dispatch((setNoFocus(...args))),
    unlock: (...args) => dispatch((unlock(...args))),
    setParentPath: (...args) => dispatch(setParentPath(...args))
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
