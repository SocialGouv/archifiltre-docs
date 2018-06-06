import React from 'react'
import { connect } from 'react-redux'

import { edit_hover_container, edit_hover_pencil } from 'css/app.css'

import TagsEditable from 'components/tags-editable'

import { selectReportState } from 'reducers/root-reducer'
import { startEditingTags, stopEditingTags, toggleEditingTags } from 'reducers/report-state'

import { tr } from 'dict'

class Presentational extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    if(this.props.isDummy) {
      return(
        <div className='cell small-4' style={this.props.cells_style}>
          <b>{tr('Tags')}</b><br />
          <span style={{'fontStyle':'italic'}}>{tr('Your tags here') + '...'}</span>
        </div>
      )
    }

    else {
      return (
        <div
        className={'cell small-4 ' + edit_hover_container}
        style={this.props.cells_style}
        onClick={(e) => {e.stopPropagation(); if(!this.props.isEditingTags) this.props.onClickTagsCells();}}
        onBlur={(e)=>{
          console.log('blur!');
          let currentTarget = e.currentTarget;
          setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) console.log('good');
          })
        }}
        onFocus={(e)=>{console.log('focus!')}}>
          <b>{tr('Tags')}</b>
          <span>&ensp;<i className={'fi-pencil ' + edit_hover_pencil} style={{'opacity': '0.3'}} /></span><br />
          <span>
            <TagsEditable tag_list={this.props.tags} node_id={this.props.node_id} old_content={this.props.content} />
          </span>
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

  return {
    onClickTagsCells
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps
)(Presentational)

export default Container
