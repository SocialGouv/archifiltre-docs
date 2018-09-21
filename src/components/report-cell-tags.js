import React from 'react'

import { edit_hover_container, edit_hover_pencil } from 'css/app.css'

import TagsEditable from 'components/tags-editable'
import * as ObjectUtil from 'util/object-util'

import pick from 'languages'

const tags_tr = pick({
  en: 'Tags',
})

const your_tags_here_tr = pick({
  en: 'Your tags here',
  fr: 'Vos tags ici',
})



const tags_style = {
  overflowY: 'auto',
  overflowX: 'hidden',
  maxHeight: '5em'
}

class ReportCellTags extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.setCandidateTag = this.setCandidateTag.bind(this);

    this.candidateTag = ''
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if(this.props.isEditingTags){
        this.props.endEditing();
        if(this.candidateTag.replace(/\s/g,'').length > 0){
          this.props.createTagged(this.props.node_id, this.candidateTag)
        }
      }
    }
  }

  setCandidateTag(new_value) {
    this.candidateTag = new_value
  }

  render() {
    const api = this.props.api
    if(this.props.isDummy) {
      return(
        <div className='cell small-6' style={this.props.cells_style}>
          <b>{tags_tr}</b><br />
          <span style={{'fontStyle':'italic'}}>{your_tags_here_tr + '...'}</span>
        </div>
      )
    }

    else {
      return (
        <div
        ref={this.setWrapperRef}
        className={edit_hover_container}
        style={this.props.cells_style}
        onClick={(e) => {e.stopPropagation(); if(!this.props.isEditingTags) this.props.onClickTagsCells();}}>
          <b>{tags_tr}</b>
          <span>&ensp;<i className={'fi-pencil ' + edit_hover_pencil} style={{'opacity': '0.3'}} /></span><br />
          <div style={tags_style} >
            <TagsEditable
              api={api}
              tag_ids={this.props.tag_ids}
              node_id={this.props.node_id}
              candidateTagCallback={this.setCandidateTag}
            />
          </div>
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

  props = ObjectUtil.compose({
    isEditingTags: report_state.editing_tags(),
    createTagged,
    onClickTagsCells: report_state.startEditingTags,
    endEditing: report_state.stopEditingTags,
  },props)

  return (<ReportCellTags {...props}/>)
}
