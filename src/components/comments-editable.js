import React from 'react'

import * as Css from 'css/app.css'
import * as ObjectUtil from 'util/object-util'

import pick from 'languages'


const your_comments = pick({
  en: 'Your comments here',
  fr: 'Vos commentaires ici',
})

const click_here_to_add = pick({
  en: 'Click here to add some comments!',
  fr: 'Cliquez ici pour ajouter des commentaires !',
})


const input_style = {
  border: "none",
  background: "none",
  outline: "none",
  resize: "none",
  minHeight: '5.5em',
  borderBottom: "3px solid rgb(5, 120, 200)"
}


export default class CommentsEditable extends React.Component {
  constructor(props) {
    super(props)

    this.textareaRef = this.textareaRef.bind(this)
  }

  componentDidUpdate() {
    const textarea = this.textarea
    if (textarea) {
      textarea.focus()
    }
  }

  textareaRef(dom_element) {
    this.textarea = dom_element
  }

  render() {
    const props = this.props
    const textareaRef = this.textareaRef

    const onKeyUp = props.onKeyUp
    const onMouseUp = e=>e.stopPropagation()
    const onBlur = props.onBlur

    const editing = props.editing
    const comments = props.comments


    if(editing) {
      return (
        <textarea
          className={Css.comments}
          style={input_style}
          onMouseUp={onMouseUp}
          onKeyUp={onKeyUp}
          onBlur={onBlur}
          defaultValue={comments}
          placeholder={your_comments}
          ref={textareaRef}
        />
      )
    } else if (comments.length > 0) {
      return (
        <div
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {comments} 
        </div>
      )
    } else {
      return (<span>{click_here_to_add}</span>)
    }
  }
}

