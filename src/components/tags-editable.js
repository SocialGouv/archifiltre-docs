import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import Tag from 'components/tag'

import { Set } from 'immutable'

import { selectReportState } from 'reducers/root-reducer'
import { startEditingTags, stopEditingTags } from 'reducers/report-state'
import { updateContentElementByID, addTagged, deleteTagged } from 'reducers/database'

import { commit } from 'reducers/root-reducer'
import { tr } from 'dict'

const input_style = {
  width: "7em",
  border: "none",
  background: "none",
  outline: "none",
  borderBottom: "3px solid rgb(10, 50, 100)"
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
      this.props.candidateTagCallback(event.target.value)

      if (event.keyCode === 8) { // Backspace
        if(event.target.value.length == 0 && this.props.tag_list.size > 0){
          this.props.deleteTag(this.props.tag_list.last(), this.props.node_id);
        }

      } else if (event.keyCode === 13) { // Enter
        event.preventDefault();
        if(event.target.value.length === 0) {
          this.props.endEditing();
        } else {
          this.props.addTag(event.target.value, this.props.node_id);
          event.target.value = "";
        }

      } else if (event.keyCode === 27) { // Escape
        event.stopPropagation();
        this.props.endEditing();
      }
    }

    let handle_remove = (tag) => () => {this.props.deleteTag(tag, this.props.node_id)}


    if(this.props.editing){
      if(this.props.tag_list.size > 0){
        elements = this.props.tag_list.reduce((acc, val, i) => {
          let new_element = (
            <Tag
            key={val}
            text={val}
            node_id={this.props.node_id}
            editing={true}
            remove_handler={handle_remove(val)}
            />);

          return acc === null ? [new_element] : [...acc, new_element]
        }, null)}

      let input_box = (
        <input
        key="__input__"
        style={input_style}
        onMouseUp={(e) => {e.stopPropagation();}}
        onKeyUp={keyUp}
        placeholder={tr("New tag")}
        ref={(component) => {this.textInput = component;}} />);

      res.push(...elements, input_box)
    }

    else{
      if(this.props.tag_list.size > 0){
        elements = this.props.tag_list.reduce((acc, val, i) => {
          let new_element = (
            <Tag
            key={val}
            text={val}
            editing={false}
            remove_handler={handle_remove(val)}
            />);

          return acc === null ? [new_element] : [...acc, new_element]
        }, null)

        res.push(...elements)
      }
      else{
        res.push(<span key="__closing__">{tr("Click here to add some tags!")}</span>)
      }
    }

    return (
      res
    )
  }
}


const mapStateToProps = state => {
  return {
    editing: selectReportState(state).editing_tags(),
  }
}

const mapDispatchToProps = dispatch => {
  const addTag = (tag, id) => {
    const updater = (a) => {if (a === undefined) return Set.of(tag); else return a.add(tag);}
    dispatch(updateContentElementByID(id, 'tags', updater))

    dispatch(addTagged(tag, id))

    dispatch(commit())
  }

  const deleteTag = (tag, id) => {
    dispatch(updateContentElementByID(id, 'tags', a=>a.delete(tag)))

    dispatch(deleteTagged(tag, id))

    dispatch(commit())
  }

  const endEditing = () => {
    dispatch(stopEditingTags())
  }
  return {
    addTag,
    deleteTag,
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
