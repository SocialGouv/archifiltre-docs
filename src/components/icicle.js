import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'

import { setNoDisplayRoot } from 'reducers/icicle-state'

import IcicleRect from 'components/icicle-rect'
import * as Color from 'color'

import { tr } from 'dict'

const icicle_style = {
  stroke: '#fff',
}

export const icicle_dims = {
  w:800,
  h:300
}


class Icicle extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  makeKey(id) {
    return 'icicle-display-root-'+id
  }

  removeRootId(arr) {
    return arr.slice(1)
  }

  render() {
    const x = 0
    let y = 0
    const width = icicle_dims.w
    let height = icicle_dims.h
    const trueFHeight = this.props.trueFHeight(height)
    let id = this.props.root_id
    let display_root_components = []
    const display_root = this.removeRootId(this.props.display_root)

    if (display_root.length) {
      id = display_root.slice(-1)[0]
      display_root_components = display_root.map(node_id => {
        const x_node = x
        const y_node = y
        const dx_node = width
        const dy_node = trueFHeight(node_id)
        y += dy_node
        height -= dy_node

        return (
          <g key={this.makeKey(node_id)}>
            <IcicleRect
              node_id={node_id}
              x={x_node}
              y={y_node}
              dx={dx_node}
              dy={dy_node}
              fillColor={this.props.fillColor}
            />
          </g>
        )
      })
    }

    return (
      <g>
        {display_root_components}
        <IcicleRecursive
          x={x}
          y={y}
          width={width}
          height={height}
          id={id}
          fWidth={this.props.fWidth}
          normalizeWidth={this.props.normalizeWidth}
          trueFHeight={trueFHeight}
          getChildrenIdFromId={this.props.getChildrenIdFromId}
          fillColor={this.props.fillColor}
        />
      </g>
    )
  }
}


class IcicleRecursive extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  makeKey(id) {
    return 'icicle-recursive-'+id
  }

  computeCumulative(array) {
    const ans = [0]
    for (let i = 0; i < array.length - 1; i++) {
      ans.push(array[i] + ans[i])
    }
    return ans
  }


  render() {
    const children = this.props.getChildrenIdFromId(this.props.id)
    const children_width = this.props.normalizeWidth(children.map(this.props.fWidth))
      .map(a=>a*this.props.width)
    const cumulated_children_width = this.computeCumulative(children_width)

    const children_height = children.map(this.props.trueFHeight)

    const children_component = children.map((child_id,i) => {
      const x_child = this.props.x + cumulated_children_width[i]
      const width_child = children_width[i]
      if (width_child < 1) {
        return (<g key={this.makeKey(child_id)} />)
      }

      const y_child = this.props.y
      const height_child = children_height[i]

      const x_prime = x_child
      const width_prime = width_child
      const y_prime = y_child + height_child
      const height_prime = this.props.height - height_child
      return (
        <g key={this.makeKey(child_id)}>
          <IcicleRect
            node_id={child_id}
            x={x_child}
            y={y_child}
            dx={width_child}
            dy={height_child}
            fillColor={this.props.fillColor}
          />
          <IcicleRecursive
            x={x_prime}
            y={y_prime}
            width={width_prime}
            height={height_prime}
            id={child_id}
            fWidth={this.props.fWidth}
            normalizeWidth={this.props.normalizeWidth}
            trueFHeight={this.props.trueFHeight}
            getChildrenIdFromId={this.props.getChildrenIdFromId}
            fillColor={this.props.fillColor}
          />
        </g>
      )
    })

    return (
      <g>
        {children_component}
      </g>
    )
  }
}




class Presentational extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const getChildrenIdFromId = id => {
      const node = this.props.getByID(id)
      return node.get('children').toJS()
    }

    console.time('render icicle')
    const icicle = (
      <Icicle
        root_id={this.props.root_id}
        display_root={this.props.display_root}
        fWidth={this.props.fWidth}
        normalizeWidth={this.props.normalizeWidth}
        trueFHeight={this.props.trueFHeight}
        getChildrenIdFromId={getChildrenIdFromId}
        fillColor={this.props.fillColor}
      />
    )
    console.timeEnd('render icicle')


    return (
      <div style={icicle_style}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
          <g>
            {icicle}
          </g>
        </svg>
      </div>
    )
  }
}

const mapStateToProps = state => {
  let database = selectDatabase(state)
  let icicle_state = selectIcicleState(state)

  return {
    getByID: database.getByID,
    root_id: database.root_id(),
    display_root: icicle_state.display_root(),
  }
}
 
const mapDispatchToProps = dispatch => {
  return {
    setNoDisplayRoot: (...args) => dispatch(setNoDisplayRoot(...args))
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container