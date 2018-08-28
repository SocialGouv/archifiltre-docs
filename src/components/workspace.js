import React from 'react'

import { tr } from 'dict'
import * as Color from 'color'
import * as ObjectUtil from 'util/object-util'

import Icicle from 'components/icicle'

import Report from 'components/report'
import AllTags from 'components/all-tags'
import NavigationBar from 'components/navigation-bar'


class Presentational extends React.PureComponent {
  constructor(props) {
    super(props)

    this.fillColor = this.fillColor.bind(this)
    this.getChildrenIdFromId = this.getChildrenIdFromId.bind(this)
  }


  fillColor(id) {
    if (this.props.change_skin) {
      const root_node = this.props.getFfByFfId(this.props.root_id)
      const max_time = root_node.get('last_modified_max')
      const min_time = root_node.get('last_modified_min')
      const zeroToOne = (id) => {
        const node = this.props.getFfByFfId(id)
        const time = node.get('last_modified_average')
        return (time - min_time) / (max_time - min_time)
      }

      return Color.toRgba(
        Color.gradient(
          Color.leastRecentDate(),
          Color.mostRecentDate()
        )(zeroToOne(id))
      )
    } else {
      const node = this.props.getFfByFfId(id)
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
  }

  // const zeroToOne = (id) => {
    //   const props = this.props
    //   const duplicate_node_id = props.duplicate_node_id
    //   if (!duplicate_node_id) {
    //     return 0
    //   }

    //   const database = props.database
    //   const getSubIdList = database.getSubIdList
    //   const sub_id_list = getSubIdList(duplicate_node_id,database)


    //   const getSize = node => node.get('size')
    //   const getFfByFfId = props.getFfByFfId

    //   const z2O = (duplicate_node_id) => {
    //     const duplicate_node = getFfByFfId(duplicate_node_id)
    //     const duplicate_node_size = getSize(duplicate_node)


    //     const node = getFfByFfId(id)
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


  getChildrenIdFromId(id) {
    const node = this.props.getFfByFfId(id)
    const children = node.get('children')
    if (this.props.change_skin) {
      const sort_by_date_index = node.get('sort_by_date_index').map(a=>children.get(a))

      return sort_by_date_index.toJS()
    } else {
      const sort_by_size_index = node.get('sort_by_size_index').map(a=>children.get(a))

      return sort_by_size_index.toJS()
    }
  }

  render() {
    const api = this.props.api

    return (
      <div className='grid-y grid-frame'>

        <div className='cell'>
          <div className='grid-x'>
            <div className='cell small-10' style={{paddingRight:'.9375em'}}>
              <Report
                fillColor={this.fillColor}
                api={api}
              />
            </div>
            <div className='cell small-2'>
              <AllTags api={api}/>
            </div>
          </div>
        </div>

        <div className='cell'>
          <div className='grid-x align-center'>
            <div className='cell shrink'>
              <NavigationBar api={api}/>
            </div>
          </div>
        </div>

        <div className='cell auto'>
          <Icicle
            fillColor={this.fillColor}
            getChildrenIdFromId={this.getChildrenIdFromId}
            api={api}
          />
        </div>
      </div>
    )
  }
}



export default (props) => {
  const api = props.api
  const icicle_state = api.icicle_state
  const database = api.database

  props = ObjectUtil.compose({
    getFfByFfId: database.getFfByFfId,
    display_root: icicle_state.display_root(),
    root_id: database.rootFfId(),
    change_skin: icicle_state.changeSkin(),
  },props)

  return (<Presentational {...props}/>)
}

