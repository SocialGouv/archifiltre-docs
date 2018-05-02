import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'

import { setNoDisplayRoot } from 'reducers/icicle-state'

import IcicleRect from 'components/icicle-rect'
import {positionNodes} from 'components/node-placer'

import { tr } from 'dict'

const icicle_style = {
  position: 'relative',
  stroke: '#fff',
  // 'background-color': 'rgba(100,100,100,0.1)'
}

export const icicle_dims = {
  w:800,
  h:300
}

const types = {
    presentation : {label: tr("Presentation"), color:"#f75b40"},
    parent_folder : {label: tr("Root"), color: "#f99a0b"},
    folder : {label: tr("Folder"), color:"#fabf0b"},
    spreadsheet : {label: tr("Spreadsheet"), color:"#52d11a"},
    email: {label: tr("E-mail"), color:"#13d6f3"},
    doc : {label: tr("Document"), color:"#4c78e8"},
    multimedia: {label: tr("Multimedia"), color:"#b574f2"},
    otherfiles : {label: tr("Others"), color:"#8a8c93"}
  };




class Presentational extends React.Component {
  constructor(props) {
    super(props)
    this.root_id = props.root_id
    this.max_tree_depth = props.max_depth
    this.isZoomed = this.props.isZoomed

    this.getByID = props.getByID

    this.plot = this.plot.bind(this)

    console.log("profondeur : ", this.max_tree_depth)

    setNoDisplayRoot()
  }

  shouldComponentUpdate(nextProps, nextState) {
    // if(nextProps.hover_sequence !== this.props.hover_sequence) return true;
    
    if(nextProps.display_root !== this.props.display_root) return true;
    return false;
  }


  plot(root, root_seq, tree_depth) {
    console.time("render icicle")
    let icicle = this.positionNodes(root, root_seq, 0, icicle_dims.w, 0, icicle_dims.h, tree_depth, [], this.getByID, this.isZoomed)

    // let icicle = <NodePlacer
    //   root_id={root}
    //   root_seq={root_seq}
    //   left="0"
    //   right={icicle_dims.w}
    //   top="0"
    //   bottom={icicle_dims.h}
    //   tree_depth={tree_depth}
    //   sequence={[]}
    //   getByID={this.getByID}
    //   isZoomed={this.isZoomed} />;

    // let icicle = positionNodes({
    //       root_id: root,
    //       root_seq,
    //       left: 0,
    //       right: icicle_dims.w,
    //       top: 0,
    //       bottom: icicle_dims.h,
    //       tree_depth,
    //       sequence: [],
    //       getByID: this.getByID,
    //       isZoomed: this.isZoomed
    //     })

    console.timeEnd("render icicle")
    return icicle
  }


  positionNodes(root_id, root_seq, left, right, top, bottom, tree_depth, sequence){
    let root = this.getByID(root_id)
    let height = bottom - top
    let width = right - left
    let new_sequence = sequence.concat(root_id)

    let root_dims={
      x: left,
      y: top,
      dx: (isNaN(width) ? 0 : width),
      dy: height/tree_depth
    }

    let res = (
      root_dims.dx < 1 ?
      []
      :
      [<IcicleRect key={root.get('name') + root.get('depth')} dims={root_dims} node_id={root_id} node={root} node_sequence={new_sequence} />])

    let children = root.get('children')
    if (children.size && root_dims.dx > 1) {

      if(this.props.isZoomed && root_seq.length > 1){
        let child = this.getByID(root_seq[1])

        res.push(this.positionNodes(
          root_seq[1],
          root_seq.slice(1,root_seq.length),
          left,
          right,
          top+height/tree_depth,
          bottom,
          tree_depth-1,
          new_sequence))
      }

      else{
      let x_cursor = left
        for (let i = 0; i <= children.size - 1; ++i) {
            let child = this.getByID(children.get(i))
            const child_size = child.content.size
            const root_size = root.get('content').get('size')

            res.push(this.positionNodes(
              children.get(i),
              root_seq,
              x_cursor,
              x_cursor+child_size/root_size*width,
              top+height/tree_depth,
              bottom,
              tree_depth-1,
              new_sequence))

            x_cursor = x_cursor+child_size/root_size*width
        }
      }
    }

    return res
  }

  render() {
    return (
      <div id='chart' style={icicle_style}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
          <g id="container">
            {this.plot(this.props.root_id, (this.props.isZoomed ? this.props.display_root : []), this.max_tree_depth + 1)}
          </g>
        </svg>
      </div>)
  }
}

export const typeOf = (node) => {
  
  if (node.get('children').size) {
    if (node.get('children').get(0) === "-1") {
      return types.parent_folder;
    } else {
      return types.folder;
    }
  }

  else {
    let m = node.get('name').match(/\.[^\.]*$/)

    if (m == null)
      m = [""]

    switch(m[0].toLowerCase()){
      case ".xls": //formats Microsoft Excel
      case ".xlsx":
      case ".xlsm":
      case ".xlw": // dont les vieux
      case ".xlt":
      case ".xltx":
      case ".xltm":
      case ".csv": // format Csv
      case ".ods": //formats OOo/LO Calc
      case ".ots":
        return types.spreadsheet;
      case ".doc":  //formats Microsoft Word
      case ".docx":
      case ".docm":
      case ".dot":
      case ".dotx":
      case ".dotm":
      case ".odt": // formats OOo/LO Writer
      case ".ott":
      case ".txt": // formats texte standard
      case ".rtf":
        return types.doc;
      case ".ppt": // formats Microsoft PowerPoint
      case ".pptx":
      case ".pptm":
      case ".pps":
      case ".ppsx":
      case ".pot":
      case ".odp": // formats OOo/LO Impress
      case ".otp":
      case ".pdf": // On considère le PDF comme une présentation
        return types.presentation;
      case ".eml": //formats d'email et d'archive email
      case ".msg":
      case ".pst":
        return types.email;
      case ".jpeg": //formats d'image
      case ".jpg":
      case ".gif":
      case ".png":
      case ".bmp":
      case ".tiff":
      case ".mp3": //formats audio
      case ".wav":
      case ".wma":
      case ".avi":
      case ".wmv": //formats vidéo
      case ".mp4":
      case ".mov":
      case ".mkv":
        return types.multimedia;
      default:
        return types.otherfiles;
      }
    }
  }

const mapStateToProps = state => {
  let database = selectDatabase(state)
  let icicle_state = selectIcicleState(state)

  return {
    max_depth: database.max_depth(),
    node_ids: database.getIDList(),
    getByID: database.getByID,
    root_id: database.getRootIDs()[0],
    display_root: icicle_state.display_root(),
    isZoomed: icicle_state.isZoomed(),
    isFocused: icicle_state.isFocused(),
    hover_sequence: icicle_state.hover_sequence()
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