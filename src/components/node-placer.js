import React from 'react'
import { connect } from 'react-redux'

import IcicleRect from 'components/icicle-rect'

import { tr } from 'dict'


  // positionNodes(root_id, root_seq, left, right, top, bottom, tree_depth, sequence, getByID, isZoomed){
    export const positionNodes = (props) => {
    let root = props.getByID(props.root_id)
    let height = props.bottom - props.top
    let width = props.right - props.left
    let new_sequence = props.sequence.concat(props.root_id)

    let root_dims={
      x: props.left,
      y: props.top,
      dx: (isNaN(width) ? 0 : width),
      dy: height/props.tree_depth
    }

    let res = (
      root_dims.dx < 1 ?
      []
      :
      [<IcicleRect key={root.get('name') + root.get('depth')} dims={root_dims} node_id={props.root_id} node={root} node_sequence={new_sequence} />])

    let children = root.get('children')
    if (children.size && root_dims.dx > 1) {

      if(props.isZoomed && props.root_seq.length > 1){
        let child = props.getByID(props.root_seq[1])

        res.push(positionNodes({
          root_id: props.root_seq[1],
          root_seq: props.root_seq.slice(1,props.root_seq.length),
          left: props.left,
          right: props.right,
          top: props.top+height/props.tree_depth,
          bottom: props.bottom,
          tree_depth: props.tree_depth-1,
          sequence: new_sequence,
          getByID: props.getByID,
          isZoomed: props.isZoomed
        }))
      }

      else{
      let x_cursor = props.left
        for (let i = 0; i <= children.size - 1; ++i) {
            let child = props.getByID(children.get(i))
            const child_size = child.content.size
            const root_size = root.get('content').get('size')

            res.push(positionNodes({
              root_id: children.get(i),
              root_seq: props.root_seq,
              left: x_cursor,
              right: x_cursor+child_size/root_size*width,
              top: props.top+height/props.tree_depth,
              bottom: props.bottom,
              tree_depth: props.tree_depth-1,
              sequence: new_sequence,
              getByID: props.getByID,
              isZoomed: props.isZoomed
            }))

            x_cursor = x_cursor+child_size/root_size*width
        }
      }
    }

    return res
  }