import React from 'react'
import { connect } from 'react-redux'

import Tag from 'components/tag'

import { Set } from 'immutable'

import { selectReportState } from 'reducers/root-reducer'
import { startEditingTags, stopEditingTags } from 'reducers/report-state'
import { setContentByID, addTagged, deleteTagged } from 'reducers/database'

import { commit } from 'reducers/root-reducer'
import { tr } from 'dict'

const getLastValue = (set) => {
  let value;
  for(value of set);
  return value;
}

class Presentational extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let res, elements
    res = []
    elements = []

    let keyDown = (event) => {
      if (event.keyCode === 8) { // Backspace
          if(event.target.value.length == 0){
              this.props.deleteTag(this.props.old_content, getLastValue(this.props.tag_list), this.props.node_id);
          }

      } else if (event.keyCode === 13) { // Enter
          event.preventDefault();
          if(event.target.value.length === 0) {
              this.props.endEditing();
          } else {
              this.props.addTag(this.props.old_content, event.target.value, this.props.node_id);
              event.target.value = "";
          }
      } else if (event.keyCode === 27) { // Escape
          this.props.endEditing();
      }
    }

    let handle_remove = (tag) => () => {this.props.deleteTag(this.props.old_content, tag, this.props.node_id)}


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
        onBlur={this.props.endEditing}
        onClick={(e) => {e.stopPropagation();}}
        onKeyDown={keyDown}
        placeholder={tr("New tag")}
        ref="input" />);

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
  const addTag = (content, tag, id) => {
    content = content.update('tags', a=>{if (a === undefined) return Set.of(tag); else return a.add(tag);})
    dispatch(setContentByID(id, content))

    dispatch(addTagged(tag, id))

    dispatch(commit())
  }

  const deleteTag = (content, tag, id) => {
    content = content.update('tags', a=>a.delete(tag))
    dispatch(setContentByID(id, content))

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
  mapDispatchToProps
)(Presentational)

export default Container
