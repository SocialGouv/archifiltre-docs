import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectIcicleState } from 'reducers/root-reducer'

import { setNoDisplayRoot } from 'reducers/icicle-state'

import IcicleRect from 'components/icicle-rect'

import { tr } from 'dict'

const icicle_style = {
  position: 'relative',
  stroke: '#fff',
}

export const icicle_dims = {
  w:800,
  h:300
}

export const types = {
    presentation : {label: tr("Presentation"), color:"#f75b40"},
    parent_folder : {label: tr("Root"), color: "#f99a0b"},
    folder : {label: tr("Folder"), color:"#fabf0b"},
    spreadsheet : {label: tr("Spreadsheet"), color:"#52d11a"},
    email: {label: tr("E-mail"), color:"#13d6f3"},
    doc : {label: tr("Document"), color:"#4c78e8"},
    multimedia: {label: tr("Multimedia"), color:"#b574f2"},
    otherfiles : {label: tr("Others"), color:"#8a8c93"}
  };


const makeKeyPN = (id) => 'position-nodes-'+id
const makeKeyIR = (id) => 'icicle-rect-'+id

class PositionNodes extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   let ans = true
  //   let logs = []
  //   for (let key in this.props) {
  //     ans = ans && this.props[key] === nextProps[key]
  //     if (this.props[key] !== nextProps[key]) {
  //       logs.push(key)
  //     }
  //   }
  //   // console.log(ans)
  //   // console.log(ans, logs)
  //   return true
  // }

  render() {
    const getChildrenSize = a => a.size
    const getChildrenElem = (i,a) => a.get(i)

    const root = this.props.getByID(this.props.root_id)
    const r_children = root.get('children')
    const r_content = root.get('content')
    const root_size = r_content.get('size')

    const height = this.props.bottom - this.props.top
    const width = this.props.right - this.props.left

    const x = this.props.left
    const y = this.props.top
    const dx = (isNaN(width) ? 0 : width)
    const dy = height/this.props.tree_depth

    const res = []

    if (dx < 1) {
      return (<g/>)
    } else {
      const recCall = []

      if (getChildrenSize(r_children) && dx > 1) {

        if(this.props.isZoomed && this.props.root_seq.length > 1) {
          const root_id = this.props.root_seq[1]
          recCall.push(
            <PositionNodes
              key={makeKeyPN(root_id)}
              root_id={root_id}
              root_seq={this.props.root_seq.slice(1,this.props.root_seq.length)}
              left={this.props.left}
              right={this.props.right}
              top={this.props.top+height/this.props.tree_depth}
              bottom={this.props.bottom}
              tree_depth={this.props.tree_depth-1}
              getByID={this.props.getByID}
              isZoomed={this.props.isZoomed}
            />
          )
        } else {
          let x_cursor = this.props.left
          for (let i = 0; i <= getChildrenSize(r_children) - 1; ++i) {
            const child_id = getChildrenElem(i, r_children)
            const child = this.props.getByID(child_id)
            const child_size = child.content.size

            recCall.push(
              <PositionNodes
                key={makeKeyPN(child_id)}
                root_id={child_id}
                root_seq={this.props.root_seq}
                left={x_cursor}
                right={x_cursor+child_size/root_size*width}
                top={this.props.top+height/this.props.tree_depth}
                bottom={this.props.bottom}
                tree_depth={this.props.tree_depth-1}
                getByID={this.props.getByID}
                isZoomed={this.props.isZoomed}
              />
            )

            x_cursor = x_cursor+child_size/root_size*width
          }
        }
      }

      return (
        <g>
          <IcicleRect
            key={makeKeyIR(this.props.root_id)}
            node_id={this.props.root_id}
            x={x}
            y={y}
            dx={dx}
            dy={dy}
          />
          {recCall}
        </g>
      )

    }
  }
}




class Presentational extends React.Component {
  constructor(props) {
    super(props)

    this.plot = this.plot.bind(this)

    console.log('profondeur : ', props.max_depth)

    setNoDisplayRoot()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.display_root !== this.props.display_root) {
      return true
    } else {
      return false
    }
  }


  plot() {
    const root_id = this.props.root_id
    // const root_seq = this.props.isZoomed ? this.props.display_root : []
    const root_seq = this.props.display_root
    const tree_depth = this.props.max_depth + 1
    const getByID = this.props.getByID
    const isZoomed = this.props.isZoomed
    console.time("render icicle")
    const icicle = (
      <PositionNodes
        key={makeKeyPN(root_id)}
        root_id={root_id}
        root_seq={root_seq}
        left={0}
        right={icicle_dims.w}
        top={0}
        bottom={icicle_dims.h}
        tree_depth={tree_depth}
        getByID={getByID}
        isZoomed={isZoomed}
      />
    )
    console.timeEnd("render icicle")
    return icicle
  }

  render() {
    return (
      <div style={icicle_style}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
          <g>
            {this.plot()}
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
  } else {
    let m = node.get('name').match(/\.[^\.]*$/)

    if (m == null)
      m = [""]

    switch (m[0].toLowerCase()) {
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
    getByID: database.getByID,
    root_id: database.root_id(),
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