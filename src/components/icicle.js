import React from 'react'
import { connect } from 'react-redux'
import { selectDatabase, selectLogError } from 'reducers/root-reducer'

import IcicleRect from 'components/icicle-rect'

import { tr } from 'dict'

const icicle_style = {
  position: 'relative',
  stroke: '#fff',
  // 'background-color': 'rgba(100,100,100,0.1)'
}

const icicle_dims = {
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
    this.max_tree_depth = this.getMaxDepth(props.nodes)
    this.nodes = props.nodes

    this.positionNodes = this.positionNodes.bind(this)
    this.getMaxDepth = this.getMaxDepth.bind(this)

    console.log("profondeur : ", this.max_tree_depth)
  }


  plot(nodes, position, tree_depth) {
    console.time("render icicle")
    let icicle = position(nodes, 0, icicle_dims.w, 0, icicle_dims.h, tree_depth, [])
    console.timeEnd("render icicle")
    console.log(nodes)
    return icicle
  }


  positionNodes(root, left, right, top, bottom, tree_depth, sequence){
    let height = bottom - top
    let width = right - left
    let new_sequence = sequence.concat(root.id)
    // let new_sequence = sequence + [root.name + root.depth]

    root.x = left
    root.y = top
    root.dx = (isNaN(width) ? 0 : width)
    root.dy = height/tree_depth

    let res = (
      root.dx < 1 ?
      []
      :
      [<IcicleRect key={root.name + root.depth} node={root} type={this.typeOf(root)} node_sequence={new_sequence} />])

    let children = root.children
    if (children && root.dx > 1) {
      let x_cursor = left
      for (let i = 0; i <= children.length - 1; ++i) {
        res.push(this.positionNodes(
          children[i],
          x_cursor,
          x_cursor+children[i].size/root.size*width,
          top+height/tree_depth,
          bottom,
          tree_depth-1,
          new_sequence))
        x_cursor = x_cursor+children[i].size/root.size*width
      }
    }

    return res
  }

  getMaxDepth(tree){
    let children = tree.children
    if(children){
      return children.reduce((acc, val) => {if(this.getMaxDepth(val) > acc) return this.getMaxDepth(val) ; else return acc}, 0)
    }
    else{
      return tree.depth
    }
  }

  typeOf(node) {
    
    if (node["children"]) {
      if (false) {
        return types.parent_folder;
      } else {
        return types.folder;
      }
    }

    else {
      let m = node["name"].match(/\.[^\.]*$/)

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

  render() {
    return (
      <div id='chart' style={icicle_style}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
          <g id="container">
            {this.plot(this.nodes, this.positionNodes, this.max_tree_depth + 1)}
          </g>
        </svg>
      </div>)
  }
}


const mapStateToProps = state => {
  return {}
}
 
const mapDispatchToProps = dispatch => {
  return {}
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container