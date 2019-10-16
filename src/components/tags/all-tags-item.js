import React from "react";

import Tag from "components/tags/tag";

import MultiLinesInput from "components/multi-lines-input";

const cell_shrink_style = {
  padding: "0em 0.1em"
};

class AllTagsItem extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = null;
  }

  componentDidUpdate() {
    if (this.textInput) this.textInput.focus();
  }

  render() {
    const {
      tag,
      opacity,
      percentage,
      deleteTag,
      shoud_display_count,
      tag_number,
      node_has_tag,
      removeTagFromNode,
      addTagToNode,
      editing,
      renameTag,
      stopEditingTag,
      startEditingTag,
      highlightTag
    } = this.props;

    const componentStyle = {
      position: "relative",
      width: "100%",
      background: "none",
      margin: "0",
      padding: "4px 0.5em"
    };

    const contentStyle = {
      opacity: opacity,
      position: "relative",
      zIndex: "1"
    };

    const backgroundStyle = {
      transition: "all 0.4s",
      WebkitTransition: "all 0.4s",
      height: "100%",
      width: `${percentage}%`,
      opacity: "0.2",
      backgroundColor: "rgb(10, 50, 100)"
    };

    const deleteBubble = (
      <div className="tags_bubble tags_cross" onClick={deleteTag}>
        <i className="fi-trash" />
      </div>
    );

    const countOrActionBubble = shoud_display_count ? (
      <div className="tags_bubble tags_count">{tag_number}</div>
    ) : node_has_tag ? (
      <div className="tags_bubble tags_cross" onClick={removeTagFromNode}>
        <i className="fi-x" />
      </div>
    ) : (
      <div className="tags_bubble tags_add" onClick={addTagToNode}>
        <i className="fi-plus" />
      </div>
    );

    let tagPill;
    if (editing) {
      tagPill = (
        <MultiLinesInput
          value={tag}
          onFinish={value => {
            if (value !== "") {
              renameTag(value);
            }
            stopEditingTag();
          }}
          autofocus={true}
        />
      );
    } else {
      tagPill = (
        <Tag
          text={tag}
          editing={false}
          clickHandler={startEditingTag}
          removeHandler={() => {}}
        />
      );
    }

    const pencil = editing ? (
      <span />
    ) : (
      <i
        className="fi-pencil edit_hover_pencil"
        style={{ opacity: "0.3", paddingLeft: "0.4em" }}
      />
    );

    return (
      <div
        className="edit_hover_container"
        onMouseEnter={highlightTag}
        style={componentStyle}
      >
        <div className="grid-x" style={contentStyle}>
          <div className="cell shrink" style={cell_shrink_style}>
            {deleteBubble}
          </div>
          <div className="cell shrink" style={cell_shrink_style}>
            {countOrActionBubble}
          </div>
          <div className="cell auto" style={cell_shrink_style}>
            {tagPill}
          </div>
          <div className="cell shrink" style={cell_shrink_style}>
            {pencil}
          </div>
        </div>
        <div className="background" style={backgroundStyle} />
      </div>
    );
  }
}

export default AllTagsItem;
