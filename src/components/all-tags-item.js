import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import Tag from 'components/tag'

// import { Set } from 'immutable'

// import { selectReportState } from 'reducers/root-reducer'
// import { startEditingTags, stopEditingTags } from 'reducers/report-state'
// import { addTagged, deleteTagged } from 'reducers/database'

import { tags_bubble, tags_count, tags_add, tags_cross, edit_hover_container, edit_hover_pencil } from 'css/app.css'

import { commit } from 'reducers/root-reducer'
import { tr } from 'dict'

const input_style = {
  width: "7em",
  border: "none",
  background: "none",
  outline: "none",
  paddingBottom: 0,
  borderBottom: "3px solid rgb(10, 50, 100)",
  marginBottom: "2px",
  fontSize: "1.15em"
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
      if (event.keyCode === 13) { // Enter
        event.preventDefault();
        if(event.target.value.length > 0) {
          this.props.renameTag(event.target.value);
          event.target.value = "";
        }
        this.props.stopEditingTag();

      } else if (event.keyCode === 27) { // Escape
        this.props.stopEditingTag();
      }
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

    let tag_pill = (
      this.props.editing ?
      (<input
        style={input_style}
        onFocus={(e) => {e.target.select();}}
        onMouseUp={(e) => {e.stopPropagation();}}
        onKeyUp={keyUp}
        onBlur={(e) => {this.props.renameTag(e.target.value); this.props.stopEditingTag()}}
        defaultValue={tag}
        placeholder={tr("Rename tag")}
        ref={(component) => {this.textInput = component;}} />)
      : (<Tag
        text={tag}
        editing={false}
        click_handler={this.props.startEditingTag}
        remove_handler={() => {}}
        />)
    );

    let pencil = this.props.editing ? <span /> : (<i className={'fi-pencil ' + edit_hover_pencil} style={{'opacity': '0.3'}} />);

    res = (
      <div
      className= { edit_hover_container }
      onMouseEnter={this.props.highlightTag}
      style={{opacity: this.props.opacity, width:'20em', background: 'none'}}>
        {delete_bubble}
        {count_or_add_bubble}
        {tag_pill}
        {pencil}
      </div>
    );

    return (
      res
    )
  }
}


const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = dispatch => {
  return {
  }
}


const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {withRef:true}
)(Presentational)

export default Container
