import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import Tag from 'components/tag'

// import { Set } from 'immutable'

// import { selectReportState } from 'reducers/root-reducer'
// import { startEditingTags, stopEditingTags } from 'reducers/report-state'
// import { addTagged, deleteTagged } from 'reducers/database'

import { tags_bubble, tags_count, tags_add, tags_cross } from 'css/app.css'

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

    let keyUp = (event) => {
      // this.props.candidateTagCallback(event.target.value)

      // if (event.keyCode === 8) { // Backspace
      //   if(event.target.value.length == 0 && this.props.tag_list.size > 0){
      //     this.props.deleteTag(this.props.tag_list.last(), this.props.node_id);
      //   }

      // } else if (event.keyCode === 13) { // Enter
      //   event.preventDefault();
      //   if(event.target.value.length === 0) {
      //     this.props.endEditing();
      //   } else {
      //     this.props.addTag(event.target.value, this.props.node_id);
      //     event.target.value = "";
      //   }

      // } else if (event.keyCode === 27) { // Escape
      //   event.stopPropagation();
      //   this.props.endEditing();
      // }
    }

    let res

    let tag = this.props.tag

    let delete_bubble = (
      <div className={tags_bubble + " " + tags_cross} onClick={this.props.deleteTag}>
        <i className='fi-x' />
      </div>
    );

    let count_or_add_bubble = (
      this.props.shoud_display_add ?
      (<div className={tags_bubble + " " + tags_add} onClick={this.props.addTagToNode}><i className='fi-plus' /></div>)
      : (<div className={tags_bubble + " " + tags_count}>{this.props.tag_number}</div>)
    );

    res = (
      <div
      key={tag}
      onMouseEnter={this.props.highlightTag}
      onMouseLeave={this.props.stopHighlightingTag}
      onClick={(e) => {}}
      style={{this.props.opacity, width:'20em'}}>
        {delete_bubble}
        {count_or_add_bubble}
        <Tag
          text={tag}
          editing={false}
          remove_handler={() => {}}
          />
      </div>
    );


    // if(this.props.editing){
      // this.props.candidateTagCallback('')
      // if(this.props.tag_list.size > 0){
      //   elements = this.props.tag_list.reduce((acc, val, i) => {
      //     let new_element = (
      //       <Tag
      //       key={val}
      //       text={val}
      //       node_id={this.props.node_id}
      //       editing={true}
      //       remove_handler={handle_remove(val)}
      //       />);

      //     return acc === null ? [new_element] : [...acc, new_element]
      //   }, null)}

      // let input_box = (
      //   <input
      //   key="__input__"
      //   style={input_style}
      //   onMouseUp={(e) => {e.stopPropagation();}}
      //   onKeyUp={keyUp}
      //   placeholder={tr("New tag")}
      //   ref={(component) => {this.textInput = component;}} />);

      // res.push(...elements, input_box)
    // }

    // else{
      // if(this.props.tag_list.size > 0){
      //   elements = this.props.tag_list.reduce((acc, val, i) => {
      //     let new_element = (
      //       <Tag
      //       key={val}
      //       text={val}
      //       editing={false}
      //       remove_handler={handle_remove(val)}
      //       />);

      //     return acc === null ? [new_element] : [...acc, new_element]
      //   }, null)

      //   res.push(...elements)
      // }
      // else{
      //   res.push(<span key="__closing__">{tr("Click here to add some tags!")}</span>)
      // }
    // }

    return (
      res
    )
  }
}


const mapStateToProps = state => {
  return {
    // editing: selectReportState(state).editing_tags(),
  }
}

const mapDispatchToProps = dispatch => {
  // const addTag = (tag, id) => {
  //   dispatch(addTagged(tag, id))
  //   dispatch(commit())
  // }

  // const deleteTag = (tag, id) => {
  //   dispatch(deleteTagged(tag, id))
  //   dispatch(commit())
  // }

  // const endEditing = () => {
  //   dispatch(stopEditingTags())
  // }
  return {
    // addTag,
    // deleteTag,
    // endEditing,
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {withRef:true}
)(Presentational)

export default Container
