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



class Icicle extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  makeKey(id) {
    return 'icicle-display-root-'+id
  }

  render() {
    const x = 0
    let y = 0
    const width = icicle_dims.w
    let height = icicle_dims.h
    const trueFHeight = this.props.trueFHeight(height)
    let id = this.props.root_id
    let display_root_components = []
    const display_root = this.props.display_root.slice(1)

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
    const display_root = this.props.display_root
    const max_depth = this.props.max_depth
    const getByID = this.props.getByID
   
    const fWidth = id => {
      // const node = getByID(id)
      // return node.get('content').get('size')

      const node = getByID(id)
      return node.get('content').get('nb_files')
    }

    const normalizeWidth = arr => {
      const sum = arr.reduce((a,b)=>a+b,0)
      const ans = arr.map(a=>a/sum)
      return ans
    }

    const trueFHeight = max_height => id => {
      // return max_height/max_depth

      const node = getByID(id)
      const len = node.get('name').length
      return len * (max_height/260)
    }

    const getChildrenIdFromId = id => {
      const node = getByID(id)
      return node.get('children').toJS()
    }

    console.time('render icicle')
    const icicle = (
      <Icicle
        root_id={root_id}
        display_root={display_root}
        fWidth={fWidth}
        normalizeWidth={normalizeWidth}
        trueFHeight={trueFHeight}
        getChildrenIdFromId={getChildrenIdFromId}
      />
    )
    console.timeEnd('render icicle')
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