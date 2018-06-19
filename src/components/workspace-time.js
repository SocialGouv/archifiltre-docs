import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'
import { sortByDate } from 'reducers/database'

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
    this.props.dispatch(sortByDate())
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
      Color.gradient(
        Color.leastRecentDate(),
        Color.mostRecentDate()
      )(zeroToOne(id))
    )



    // const zeroToOne = (id) => {
    //   const props = this.props
    //   const duplicate_node_id = props.duplicate_node_id
    //   if (!duplicate_node_id) {
    //     return 0
    //   }

    //   const database = props.database
    //   const getSubIdList = database.getSubIdList
    //   const sub_id_list = getSubIdList(duplicate_node_id,database)


    //   const getSize = node => node.get('content').get('size')
    //   const getByID = props.getByID

    //   const z2O = (duplicate_node_id) => {
    //     const duplicate_node = getByID(duplicate_node_id)
    //     const duplicate_node_size = getSize(duplicate_node)


    //     const node = getByID(id)
    //     const node_size = getSize(node)
    //     if (node_size === duplicate_node_size) {
    //       return 1
    //     } else {
    //       return 0
    //     }
    //   }

    //   let ans = 0
    //   for (let i = 0; i < sub_id_list.size; i++) {
    //     ans = z2O(sub_id_list.get(i))
    //     if (ans === 1) {
    //       break;
    //     }
    //   }

    //   return ans
    // }

    // return Color.toRgba(
    //   Color.gradient(
    //     Color.different(),
    //     Color.duplicate()
    //   )(zeroToOne(id))
    // )




    // const node = this.props.getByID(id)
    // const name = node.get('name')

    // if (node.get('children').size) {
    //   if (this.props.display_root.includes(id)) {
    //     return Color.parentFolder()
    //   } else {
    //     return Color.folder()
    //   }
    // } else {
    //   return Color.fromFileName(name)
    // }

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
    root_id: database.rootId(),
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





