import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'
import { sortBySize } from 'reducers/database'

import { tr } from 'dict'
import * as Color from 'color'

import Icicle from 'components/icicle'

import Report from 'components/report'
import AllTags from 'components/all-tags'
import NavigationBar from 'components/navigation-bar'


class Presentational extends React.PureComponent {
  constructor(props) {
    super(props)

    this.fillColor = this.fillColor.bind(this)
    this.props.dispatch(sortBySize())
  }


  fillColor(id) {
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
      <div className='grid-y grid-frame'>

        <div className='cell'>
          <div className='grid-x'>
            <div className='cell small-10' style={{paddingRight:'.9375em'}}>
              <Report
                fillColor={this.fillColor}
              />
            </div>
            <div className='cell small-2'>
              <AllTags />
            </div>
          </div>
        </div>

        <div className='cell'>
          <div className='grid-x align-center'>
            <div className='cell shrink'>
              <NavigationBar />
            </div>
          </div>
        </div>

        <div className='cell auto'>
          <Icicle
            fillColor={this.fillColor}
          />
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  const database = selectDatabase(state)
  const icicle_state = selectIcicleState(state)

  return {
    getByID: database.getByID,
    display_root: icicle_state.display_root(),
  }
}
 
const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
