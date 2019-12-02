import React from "react";

import { withTranslation } from "react-i18next";

const inputStyle = {
  border: "none",
  background: "none",
  outline: "none",
  resize: "none",
  minHeight: "5.5em",
  borderBottom: "3px solid rgb(5, 120, 200)"
};

class CommentsEditable extends React.Component {
  constructor(props) {
    super(props);

    this.textareaRef = this.textareaRef.bind(this);
  }

  componentDidUpdate() {
    const textarea = this.textarea;
    if (textarea) {
      textarea.focus();
    }
  }

  textareaRef(dom_element) {
    this.textarea = dom_element;
  }

  render() {
    const props = this.props;
    const textareaRef = this.textareaRef;

    const onKeyUp = props.onKeyUp;
    const onMouseUp = e => e.stopPropagation();
    const onBlur = props.onBlur;

    const editing = props.editing;
    const comments = props.comments;

    if (editing) {
      return (
        <textarea
          className="comments"
          style={inputStyle}
          onMouseUp={onMouseUp}
          onKeyUp={onKeyUp}
          onBlur={onBlur}
          defaultValue={comments}
          placeholder={props.t("report.yourCommentsHere")}
          ref={textareaRef}
        />
      );
    } else if (comments.length > 0) {
      return (
        <div
          style={{
            wordWrap: "break-word",
            whiteSpace: "pre-wrap"
          }}
        >
          {comments}
        </div>
      );
    } else {
      return <span>{props.t("report.clickHereToAddComments")}</span>;
    }
  }
}

export default withTranslation()(CommentsEditable);
