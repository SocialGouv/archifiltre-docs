import React from 'react'
import { connect } from 'react-redux'

import { edit_hover_container, edit_hover_pencil } from 'css/app.css'

import TagsEditable from 'components/tags-editable'

import { selectReportState } from 'reducers/root-reducer'
import { startEditingTags, stopEditingTags, toggleEditingTags } from 'reducers/report-state'

import { tr } from 'dict'

const tags_style = {
  overflowY: 'auto',
  overflowX: 'hidden',
  maxHeight: '5em'
}

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
      if(this.props.isEditingTags)
        this.props.endEditing();
    }
  }

  render() {
    if(this.props.isDummy) {
      return(
        <div className='cell small-6' style={this.props.cells_style}>
          <b>{tr('Tags')}</b><br />
          <span style={{'fontStyle':'italic'}}>{tr('Your tags here') + '...'}</span>
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
          <b>{tr('Tags')}</b>
          <span>&ensp;<i className={'fi-pencil ' + edit_hover_pencil} style={{'opacity': '0.3'}} /></span><br />
          <div style={tags_style} >
            <TagsEditable tag_list={this.props.tags} node_id={this.props.node_id} old_content={this.props.content} />
          </div>
        </div>
      )
    }
  }
}


const mapStateToProps = state => {
  let report_state = selectReportState(state)

  return {
    isEditingTags: report_state.editing_tags(),
  }
}

const mapDispatchToProps = dispatch => {
  const onClickTagsCells = () => {
    dispatch(startEditingTags())
  }

  const endEditing = () => {
    dispatch(stopEditingTags())
  }

  return {
    onClickTagsCells,
    endEditing
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {withRef:true}
)(Presentational)

export default Container
