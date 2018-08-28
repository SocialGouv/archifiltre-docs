import React from 'react'

import { comments } from 'css/app.css'
import * as ObjectUtil from 'util/object-util'

import { tr } from 'dict'

const input_style = {
  border: "none",
  background: "none",
  outline: "none",
  resize: "none",
  minHeight: '5.5em',
  borderBottom: "3px solid rgb(5, 120, 200)"
}

class Presentational extends React.Component {
  constructor(props) {
    super(props)
    this.textInput = null
  }

  componentDidUpdate(){
    if(this.textInput) this.textInput.focus()
  }

  render() {
    let res, elements
    res = []
    elements = []

    let keyUp = (event) => {
      if (event.keyCode === 27) { // Escape
        event.stopPropagation();
        this.props.endEditing(event.target.value, this.props.old_content, this.props.node_id);
      }
      else {
        event.stopPropagation();
        this.props.editTrigger(event.target.value, this.props.node_id)
      }
    }

    if(this.props.editing) {
      res = (
        <textarea
        className={comments}
        style={input_style}
        onMouseUp={(e) => {e.stopPropagation();}}
        onKeyUp={keyUp}
        onBlur={(e) => {this.props.endEditing()}}
        defaultValue={this.props.comments.length > 0 ? this.props.comments : ""}
        placeholder={this.props.comments.length > 0 ? "" : tr("Your comments here")}
        ref={(component) => {this.textInput = component;}} />);
    }
    else if(this.props.comments.length > 0){
      res = (
        <div>
          {this.props.comments.split('\n').map((item, key) => {
          return <span key={key}>{item}<br/></span>
          })}
        </div>
        );
    }
    else {
      res = <span>{tr("Click here to add some comments!")}</span>
    }
    

    return (
      res
    )
  }
}


export default (props) => {
  const api = props.api
  const report_state = api.report_state
  const database = api.database

  const editTrigger = (candidate_comments, id) => {
    if(true){
      const updater = () => candidate_comments
      database.updateComments(updater,id)
    }
  }

  const endEditing = () => {
    report_state.stopEditingComments()
    api.undo.commit()
  }


  props = ObjectUtil.compose({
    editing: report_state.editing_comments(),
    editTrigger,
    endEditing,
  },props)

  return (<Presentational {...props}/>)
}


// const Container = connect(
//   mapStateToProps,
//   mapDispatchToProps,
//   null,
//   {withRef:true}
// )(Presentational)

// export default Container
