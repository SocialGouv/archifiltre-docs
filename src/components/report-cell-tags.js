import React from "react";

import TagsEditable from "components/tags-editable";
import * as ObjectUtil from "util/object-util";

import pick from "languages";

const tags_tr = pick({
  en: "Tags"
});

const your_tags_here_tr = pick({
  en: "Your tags here",
  fr: "Vos tags ici"
});

const tags_style = {
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

    const setCandidateTag = this.setCandidateTag;

    setCandidateTag(value);
  }

  onKeyUp(event) {
    const keyCode = event.keyCode;
    const value = event.target.value;

    const props = this.props;

    const node_id = props.node_id;
    const tag_ids = props.tag_ids;
    const createTagged = props.createTagged;
    const deleteTagged = props.deleteTagged;

    const stopEditing = this.stopEditing;
    const setCandidateTag = this.setCandidateTag;

    const backspace_key_code = 8;
    const enter_key_code = 13;
    const escape_key_code = 27;

    if (keyCode === backspace_key_code) {
      if (value.length == 0 && tag_ids.size > 0) {
        deleteTagged(node_id, tag_ids.last());
      }
    } else if (keyCode === enter_key_code) {
      event.preventDefault();
      if (value.length === 0) {
        // stopEditing()
      } else {
        createTagged(node_id, value);
        setCandidateTag("");
      }
    } else if (keyCode === escape_key_code) {
      event.stopPropagation();
      stopEditing();
    }
  }

  removeHandlerFactory(tag_id) {
    const props = this.props;

    const node_id = props.node_id;
    const deleteTagged = props.deleteTagged;

    return () => deleteTagged(node_id, tag_id);
  }

  onClick(event) {
    event.stopPropagation();

    const state = this.state;
    const editing = state.editing;

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
    const props = this.props;

    const node_id = props.node_id;
    const createTagged = props.createTagged;

    const state = this.state;
    const editing = state.editing;
    const candidate_tag = state.candidate_tag;

    const stopEditing = this.stopEditing;
    const wrapper_ref = this.wrapper_ref;

    if (wrapper_ref && !wrapper_ref.contains(event.target)) {
      if (editing) {
        stopEditing();
        if (candidate_tag.replace(/\s/g, "").length > 0) {
          createTagged(node_id, candidate_tag);
        }
      }
    }
  }

  render() {
    const props = this.props;

    const is_dummy = props.is_dummy;
    const cells_style = props.cells_style;
    const tag_ids = props.tag_ids;
    const getTagByTagId = props.getTagByTagId;

    const state = this.state;
    const editing = state.editing;
    const candidate_tag = state.candidate_tag;

    const onClick = this.onClick;
    const onKeyUp = this.onKeyUp;
    const onChange = this.onChange;
    const removeHandlerFactory = this.removeHandlerFactory;
    const setWrapperRef = this.setWrapperRef;

    if (is_dummy) {
      return (
        <div className="cell small-6" style={cells_style}>
          <b>{tags_tr}</b>
          <br />
          <span style={{ fontStyle: "italic" }}>
            {your_tags_here_tr + "..."}
          </span>
        </div>
      );
    } else {
      return (
        <div
          ref={setWrapperRef}
          className="edit_hover_container"
          style={cells_style}
          onClick={onClick}
        >
          <b>{tags_tr}</b>
          <span>
            &ensp;
            <i
              className="fi-pencil edit_hover_pencil"
              style={{ opacity: "0.3" }}
            />
          </span>
          <br />
          <div className="eeeeeeegrid-x" style={tags_style}>
            <TagsEditable
              tag_ids={tag_ids}
              getTagByTagId={getTagByTagId}
              editing={editing}
              onKeyUp={onKeyUp}
              removeHandlerFactory={removeHandlerFactory}
              candidate_tag={candidate_tag}
              onChange={onChange}
            />
          </div>
        </div>
      );
    }
  }
}

export default props => {
  const api = props.api;
  const database = api.database;
  const commit = api.undo.commit;

  const createTagged = (ff_id, tag_name) => {
    database.createTagged(ff_id, tag_name);
    commit();
  };

  const deleteTagged = (ff_id, tag_id) => {
    database.deleteTagged(ff_id, tag_id);
    commit();
  };

  const getTagByTagId = database.getTagByTagId;

  props = ObjectUtil.compose(
    {
      createTagged,
      deleteTagged,
      getTagByTagId
    },
    props
  );

  return <ReportCellTags {...props} />;
};
