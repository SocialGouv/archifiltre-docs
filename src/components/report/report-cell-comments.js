import React from "react";

import CommentsEditable from "components/report/comments-editable";
import { withTranslation } from "react-i18next";

class ReportCellComments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
      comments: ""
    };

    this.startInput = this.startInput.bind(this);
    this.input = this.input.bind(this);
    this.stopInput = this.stopInput.bind(this);

    this.comments = this.comments.bind(this);

    this.onKeyUp = this.onKeyUp.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClick = this.onClick.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
  }

  startInput() {
    const props = this.props;

    const comments = props.comments;

    this.setState({
      editing: true,
      comments
    });
  }

  input(comments) {
    this.setState({
      comments
    });
  }

  stopInput() {
    const props = this.props;
    const state = this.state;

    const comments = state.comments;

    props.updateComment(comments);

    this.setState({
      editing: false,
      comments: ""
    });
  }

  comments() {
    if (this.state.editing) {
      return this.state.comments;
    } else {
      return this.props.comments;
    }
  }

  onKeyUp(event) {
    event.stopPropagation();
    const escape_key_code = 27;
    if (event.keyCode === escape_key_code) {
      this.stopInput();
    } else {
      this.input(event.target.value);
    }
  }

  onBlur() {
    this.stopInput();
  }

  onClick(event) {
    event.stopPropagation();
    const state = this.state;

    const editing = state.editing;
    const startInput = this.startInput;

    if (editing === false) {
      startInput();
    }
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.onClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.onClickOutside);
  }

  setWrapperRef(dom_element) {
    this.wrapper_ref = dom_element;
  }

  onClickOutside(event) {
    const state = this.state;
    const wrapper_ref = this.wrapper_ref;
    const stopInput = this.stopInput;

    const editing = state.editing;

    if (wrapper_ref && !wrapper_ref.contains(event.target)) {
      if (editing) {
        stopInput();
      }
    }
  }

  render() {
    const props = this.props;
    const state = this.state;
    const setWrapperRef = this.setWrapperRef;
    const onClick = this.onClick;
    const onKeyUp = this.onKeyUp;
    const onBlur = this.onBlur;

    const is_dummy = props.is_dummy;
    const cells_style = props.cells_style;

    const editing = state.editing;

    const comments = this.comments();

    const comments_style = {
      overflowY: editing ? "" : "auto",
      overflowX: "hidden",
      maxHeight: "5.5em"
    };

    if (is_dummy) {
      return (
        <div className="cell small-6" style={cells_style}>
          <b>{props.t("report.comments")}</b>
          <br />
          <span style={{ fontStyle: "italic" }}>
            {props.t("report.yourCommentsHere")}
          </span>
        </div>
      );
    } else {
      return (
        <div
          data-test-id="description-edit-box"
          ref={setWrapperRef}
          className="cell small-6 edit_hover_container"
          style={cells_style}
          onClick={onClick}
        >
          <div>
            <b>{props.t("report.comments")}</b>
            <span>
              &ensp;
              <i
                className="fi-pencil edit_hover_pencil"
                style={{ opacity: "0.3" }}
              />
            </span>
            <br />
          </div>
          <div style={comments_style}>
            <CommentsEditable
              onKeyUp={onKeyUp}
              onBlur={onBlur}
              editing={editing}
              comments={comments}
            />
          </div>
        </div>
      );
    }
  }
}

export default withTranslation()(ReportCellComments);
