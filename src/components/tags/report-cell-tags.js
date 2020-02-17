import _ from "lodash";
import React from "react";

import TagsEditable from "components/tags/tags-editable";

import { withTranslation } from "react-i18next";
import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import { FaPen } from "react-icons/fa";

const tagsStyle = {
  overflowY: "auto",
  overflowX: "hidden",
  maxHeight: "5em"
};

class ReportCellTags extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      candidate_tag: ""
    };

    this.startEditing = this.startEditing.bind(this);
    this.setCandidateTag = this.setCandidateTag.bind(this);
    this.stopEditing = this.stopEditing.bind(this);

    this.onChange = this.onChange.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.removeHandlerFactory = this.removeHandlerFactory.bind(this);
    this.onClick = this.onClick.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  startEditing() {
    this.setState({
      editing: true,
      candidate_tag: ""
    });
  }

  setCandidateTag(candidate_tag) {
    this.setState({
      candidate_tag
    });
  }

  stopEditing() {
    this.setState({
      editing: false
    });
  }

  onChange(event) {
    const value = event.target.value;
    this.setCandidateTag(value);
  }

  onKeyUp(event) {
    const keyCode = event.keyCode;
    const value = event.target.value;

    const {
      filesAndFoldersId,
      tagsForCurrentFile,
      createTagged,
      deleteTagged
    } = this.props;

    const { stopEditing, setCandidateTag } = this;

    const backspaceKeyCode = 8;
    const enterKeyCode = 13;
    const escapeKeyCode = 27;
    if (keyCode === backspaceKeyCode) {
      if (value.length === 0 && tagsForCurrentFile.size > 0) {
        deleteTagged(filesAndFoldersId, _.last(tagsForCurrentFile).id);
      }
    } else if (keyCode === enterKeyCode) {
      event.preventDefault();
      if (value.length !== 0) {
        addTracker({
          title: ActionTitle.TAG_ADDED,
          type: ActionType.TRACK_EVENT,
          value: `Created tag: "${value}"`,
          eventValue: value
        });
        createTagged(value, filesAndFoldersId);
        setCandidateTag("");
      }
    } else if (keyCode === escapeKeyCode) {
      event.stopPropagation();
      stopEditing();
    }
  }

  removeHandlerFactory(tagId) {
    const { nodeId, deleteTagged } = this.props;
    return () => deleteTagged(tagId, nodeId);
  }

  onClick(event) {
    event.stopPropagation();

    const editing = this.state.editing;
    const startEditing = this.startEditing;

    if (editing === false) {
      startEditing();
    }
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(dom_element) {
    this.wrapper_ref = dom_element;
  }

  handleClickOutside(event) {
    const { node_id, createTagged } = this.props;
    const { editing, candidate_tag } = this.state;
    const { stopEditing, wrapper_ref } = this;

    if (wrapper_ref && !wrapper_ref.contains(event.target)) {
      if (editing) {
        stopEditing();
        if (candidate_tag.replace(/\s/g, "").length > 0) {
          createTagged(candidate_tag, node_id);
        }
      }
    }
  }

  render() {
    const {
      is_dummy,
      cells_style,
      tagsForCurrentFile,
      isLocked,
      isCurrentFileMarkedToDelete,
      toggleCurrentFileDeleteState
    } = this.props;
    const { editing, candidate_tag } = this.state;
    const {
      onClick,
      onKeyUp,
      onChange,
      removeHandlerFactory,
      setWrapperRef
    } = this;

    if (is_dummy) {
      return (
        <div className="cell small-6" style={cells_style}>
          <b>{this.props.t("workspace.tags")}</b>
          <br />
          <span style={{ fontStyle: "italic" }}>
            {this.props.t("workspace.yourTagsHere") + "..."}
          </span>
        </div>
      );
    } else {
      return (
        <div
          data-test-id="tag-edit-box"
          ref={setWrapperRef}
          className="edit_hover_container"
          style={cells_style}
          onClick={onClick}
        >
          <b>{this.props.t("workspace.tags")}</b>
          <span>
            &ensp;
            <FaPen className="edit_hover_pencil" style={{ opacity: "0.3" }} />
          </span>
          <br />
          <div className="grid-x" style={tagsStyle}>
            <TagsEditable
              isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
              isLocked={isLocked}
              tagsForCurrentFile={tagsForCurrentFile}
              editing={editing}
              onKeyUp={onKeyUp}
              removeHandlerFactory={removeHandlerFactory}
              candidate_tag={candidate_tag}
              onChange={onChange}
              toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
            />
          </div>
        </div>
      );
    }
  }
}

const ReportCellTagsApiToProps = props => (
  <ReportCellTags
    {...props}
    tagsForCurrentFile={props.tagsForCurrentFile}
    createTagged={props.createTag}
    deleteTagged={props.untag}
  />
);

export default withTranslation()(ReportCellTagsApiToProps);
