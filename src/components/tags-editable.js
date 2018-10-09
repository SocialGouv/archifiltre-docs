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

export default class TagsEditable extends React.Component {
  constructor(props) {
    super(props)
    this.textInput = null
  }

  componentDidUpdate(){
    if(this.textInput) {
      this.textInput.focus()
    }
  }

  render() {
    const props = this.props

    const tag_ids = props.tag_ids
    const getTagByTagId = props.getTagByTagId
    const editing = props.editing
    const candidate_tag = props.candidate_tag
    const onChange = props.onChange
    const onKeyUp = props.onKeyUp
    const removeHandlerFactory = props.removeHandlerFactory


    const tagIdsToElements = () => tag_ids.map(tag_id=>{
      const tag = getTagByTagId(tag_id)
      const name = tag.get('name')

      return (
        <div className='cell shrink' key={tag_id} style={cell_shrink_style}>
          <Tag
            text={name}
            editing={editing}
            removeHandler={removeHandlerFactory(tag_id)}
          />
        </div>
      )
    }).reduce((acc,val)=>[...acc,val],[])



    let ans

    if (editing) {
      const elements = tagIdsToElements()
      const input_box = (
        <div className='cell shrink' key='__input__' style={cell_shrink_style}>
          <input
            style={input_style}
            onMouseUp={(e) => {e.stopPropagation()}}
            onKeyUp={onKeyUp}
            placeholder={new_tag}
            ref={(component) => {this.textInput = component}}
            value={candidate_tag}
            onChange={onChange}
          />
        </div>
      )

      ans = [...elements, input_box]
    } else if (tag_ids.size > 0) {
      const elements = tagIdsToElements()
      ans = elements
    } else {
      ans = (
        <div className='cell shrink' key='__closing__' style={cell_shrink_style}>
          <span>{click_here_to_add}</span>
        </div>
      )
    }

    return (
      <div className='grid-x'>
        {ans}
      </div>
    )
  }
}

