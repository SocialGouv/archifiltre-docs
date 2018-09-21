import React from 'react'

import Tag from 'components/tag'
import * as ObjectUtil from 'util/object-util'
import { Set } from 'immutable'

import pick from 'languages'

const click_here_to_add = pick({
  en: "Click here to add some tags!",
  fr: "Cliquez ici pour ajouter des tags !",
})

const new_tag = pick({
  en: "New tag",
  fr: "Nouveau tag",
})


const input_style = {
  width: "7em",
  border: "none",
  background: "none",
  outline: "none",
  borderBottom: "3px solid rgb(10, 50, 100)"
}

const cell_shrink_style = {
  padding: '0.3em',
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
    const props = this.props
    const tag_ids = props.tag_ids
    const getTagByTagId = props.getTagByTagId
    const editing = props.editing

    const keyUp = (event) => {
      this.props.candidateTagCallback(event.target.value)

      if (event.keyCode === 8) { // Backspace
        if(event.target.value.length == 0 && tag_ids.size > 0){
          this.props.deleteTagged(this.props.node_id, tag_ids.last());
        }

      } else if (event.keyCode === 13) { // Enter
        event.preventDefault();
        if(event.target.value.length === 0) {
          this.props.endEditing();
        } else {
          this.props.createTagged(this.props.node_id, event.target.value);
          event.target.value = "";
        }

      } else if (event.keyCode === 27) { // Escape
        event.stopPropagation();
        this.props.endEditing();
      }
    }

    const handle_remove = (tag_id) => () => {this.props.deleteTagged(this.props.node_id, tag_id)}

    const tagIdsToElements = () => tag_ids.map(tag_id=>{
      const tag = getTagByTagId(tag_id)
      const name = tag.get('name')

      return (
        <div className='cell shrink' key={tag_id} style={cell_shrink_style}>
          <Tag
            text={name}
            node_id={this.props.node_id}
            editing={editing}
            remove_handler={handle_remove(tag_id)}
          />
        </div>
      )
    }).reduce((acc,val)=>[...acc,val],[])


    if (editing) {
      this.props.candidateTagCallback('')
      const elements = tagIdsToElements()
      const input_box = (
        <div className='cell shrink' key='__input__' style={cell_shrink_style}>
          <input
            style={input_style}
            onMouseUp={(e) => {e.stopPropagation();}}
            onKeyUp={keyUp}
            placeholder={new_tag}
            ref={(component) => {this.textInput = component;}}
          />
        </div>
      )

      return [...elements, input_box]
    } else if (tag_ids.size > 0) {
      const elements = tagIdsToElements()
      return elements
    } else {
      return (
        <div className='cell shrink' key='__closing__' style={cell_shrink_style}>
          <span>{click_here_to_add}</span>
        </div>
      )
    }
  }
}


export default (props) => {
  const api = props.api
  const report_state = api.report_state
  const database = api.database

  const createTagged = (ff_id,tag_name) => {
    database.createTagged(ff_id,tag_name)
    api.undo.commit()
  }

  const deleteTagged = (ff_id,tag_id) => {
    database.deleteTagged(ff_id,tag_id)
    api.undo.commit()
  }

  props = ObjectUtil.compose({
    editing: report_state.editing_tags(),
    createTagged,
    deleteTagged,
    getTagByTagId:database.getTagByTagId,
    endEditing: report_state.stopEditingTags,
  },props)

  return (<Presentational {...props}/>)
}
