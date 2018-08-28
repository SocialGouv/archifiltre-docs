import React from 'react'

import { edit_hover_container, edit_hover_pencil } from 'css/app.css'

import * as ObjectUtil from 'util/object-util'

import CommentsEditable from 'components/comments-editable'

import { tr } from 'dict'


class Presentational extends React.Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
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
      if(this.props.isEditingComments)
        this.props.endEditing();
    }
  }

  render() {
    const api = this.props.api
    const comments_style = {
      overflowY: this.props.isEditingComments ? '': 'auto',
      overflowX: 'hidden',
      maxHeight: '5.5em'
    }

    if(this.props.isDummy) {
      return(
        <div className='cell small-6' style={this.props.cells_style}>
          <b>{tr('Comments')}</b><br />
          <span style={{'fontStyle':'italic'}}>{tr('Your comments here') + '...'}</span>
        </div>
      )
    }

    else {
      return (
        <div
        ref={this.setWrapperRef}
        className={'cell small-6 ' + edit_hover_container}
        style={this.props.cells_style}
        onClick={(e) => {e.stopPropagation(); if(!this.props.isEditingComments) this.props.onClickCommentsCells();}}>
          <div>
            <b>{tr('Comments')}</b>
            <span>&ensp;<i className={'fi-pencil ' + edit_hover_pencil} style={{'opacity': '0.3'}} /></span><br />
          </div>
          <div style={comments_style} >
            <CommentsEditable
              api={api}
              comments={this.props.comments}
              node_id={this.props.node_id}
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

  const onClickCommentsCells = () => {
    report_state.startEditingComments()
  }

  const endEditing = () => {
    report_state.stopEditingComments()
    api.undo.commit()
  }


  props = ObjectUtil.compose({
    isEditingComments: report_state.editing_comments(),
    candidate_comments: report_state.candidate_comments(),
    onClickCommentsCells,
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
