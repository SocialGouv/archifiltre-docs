import _ from "lodash";
import React from "react";

import TagsEditable from "components/tags/tags-editable";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import { addTracker } from "../../logging/tracker";
import { ActionTitle, ActionType } from "../../logging/tracker-types";
import Grid from "@material-ui/core/Grid";

const TagsWrapper = styled(Grid)`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 5em;
`;

type ReportCellTagsProps = {
  createTagged: (value: string, filesAndFoldersId: string) => void;
  filesAndFoldersId: string;
  nodeId: string;
  tagsForCurrentFile: { ffIds: string[]; id: string; name: string }[];
  deleteTagged: (tagId: string, nodeId: string) => void;
  is_dummy: boolean;
  isLocked: boolean;
  isCurrentFileMarkedToDelete: boolean;
  toggleCurrentFileDeleteState: boolean;
  t: (translation: string) => string;
  node_id: string;
};

type ReportCellTagsState = {
  editing: boolean;
  candidateTag: string;
};

class ReportCellTags extends React.Component<
  ReportCellTagsProps,
  ReportCellTagsState
> {
  private wrapperRef;
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      candidateTag: "",
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
      candidateTag: "",
    });
  }

  setCandidateTag(candidateTag) {
    this.setState({
      candidateTag,
    });
  }

  stopEditing() {
    this.setState({
      editing: false,
    });
  }

  onChange(event) {
    const value = event.target.value;
    this.setCandidateTag(value);
  }

  addTag(event, value) {
    event.preventDefault();
    const { createTagged, filesAndFoldersId } = this.props;
    if (value.length !== 0) {
      addTracker({
        title: ActionTitle.TAG_ADDED,
        type: ActionType.TRACK_EVENT,
        value: `Created tag: "${value}"`,
        eventValue: value,
      });
      createTagged(value, filesAndFoldersId);
      this.setCandidateTag("");
    }
  }

  onKeyUp(event) {
    const keyCode = event.keyCode;
    const value = event.target.value;
    const { filesAndFoldersId, tagsForCurrentFile, deleteTagged } = this.props;
    const backspaceKeyCode = 8;
    const enterKeyCode = 13;
    const escapeKeyCode = 27;
    if (keyCode === backspaceKeyCode) {
      if (value.length === 0 && tagsForCurrentFile.length > 0) {
        deleteTagged(filesAndFoldersId, _.last(tagsForCurrentFile)?.id || "");
      }
    } else if (keyCode === enterKeyCode) {
      this.addTag(event, value);
    } else if (keyCode === escapeKeyCode) {
      event.stopPropagation();
      this.stopEditing();
    }
  }

  removeHandlerFactory(tagId) {
    const { nodeId, deleteTagged } = this.props;
    return () => deleteTagged(tagId, nodeId);
  }

  onClick(event) {
    event.stopPropagation();
    if (!this.state.editing) {
      this.startEditing();
    }
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  setWrapperRef(domElement) {
    this.wrapperRef = domElement;
  }

  handleClickOutside(event) {
    const { node_id, createTagged } = this.props;
    const { editing, candidateTag } = this.state;
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (editing) {
        this.stopEditing();
        if (candidateTag.replace(/\s/g, "").length > 0) {
          createTagged(candidateTag, node_id);
        }
        this.addTag(event, candidateTag);
      }
    }
  }

  render() {
    const {
      is_dummy,
      tagsForCurrentFile,
      isLocked,
      isCurrentFileMarkedToDelete,
      toggleCurrentFileDeleteState,
      t,
    } = this.props;
    const { editing, candidateTag } = this.state;

    if (is_dummy) {
      return (
        <Grid container alignItems="center">
          <Grid item>{t("workspace.yourTagsHere")}</Grid>
        </Grid>
      );
    } else {
      return (
        <div
          data-test-id="tag-edit-box"
          ref={this.setWrapperRef}
          onClick={this.onClick}
        >
          <TagsWrapper>
            <TagsEditable
              isCurrentFileMarkedToDelete={isCurrentFileMarkedToDelete}
              isLocked={isLocked}
              tagsForCurrentFile={tagsForCurrentFile}
              editing={editing}
              onKeyUp={this.onKeyUp}
              removeHandlerFactory={this.removeHandlerFactory}
              candidate_tag={candidateTag}
              onChange={this.onChange}
              toggleCurrentFileDeleteState={toggleCurrentFileDeleteState}
            />
          </TagsWrapper>
        </div>
      );
    }
  }
}

const ReportCellTagsApiToProps = (props) => (
  <ReportCellTags
    {...props}
    tagsForCurrentFile={props.tagsForCurrentFile}
    createTagged={props.createTag}
    deleteTagged={props.untag}
  />
);

export default withTranslation()(ReportCellTagsApiToProps);
