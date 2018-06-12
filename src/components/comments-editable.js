import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import { selectReportState } from 'reducers/root-reducer'
import { startEditingComments, stopEditingComments, setCandidateComments } from 'reducers/report-state'
import { setContentByID } from 'reducers/database'

import { comments } from 'css/app.css'

import { commit } from 'reducers/root-reducer'
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
        this.props.editTrigger(event.target.value, this.props.old_content, this.props.node_id)
      }
    }

    if(this.props.editing) {
      res = (
        <textarea
        className={comments}
        style={input_style}
        onMouseUp={(e) => {e.stopPropagation();}}
        onKeyUp={keyUp}
        onBlur={(e) => {this.props.endEditing(event.target.value, this.props.old_content, this.props.node_id)}}
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


const mapStateToProps = state => {
  const report_state = selectReportState(state)

  return {
    editing: report_state.editing_comments(),
  }
}

const mapDispatchToProps = dispatch => {
  const editTrigger = (candidate_comments, content, id) => {
    if(true){
      content = content.set('comments', candidate_comments)
      console.log(content.toJS())
      dispatch(setContentByID(id, content))
    }
  }

  const endEditing = () => {
    dispatch(stopEditingComments())
    dispatch(commit())
  }

  return {
    editTrigger,
    endEditing,
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {withRef:true}
)(Presentational)

export default Container
