import React from "react";

import Tag from "components/tag";

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
    const { tag } = this.props;

    const componentStyle = {
      position: "relative",
      width: "100%",
      background: "none",
      margin: "0",
      padding: "4px 0.5em"
    };

    const contentStyle = {
      opacity: this.props.opacity,
      position: "relative",
      zIndex: "1"
    };

    const backgroundStyle = {
      transition: "all 0.4s",
      WebkitTransition: "all 0.4s",
      height: "100%",
      width: this.props.percentage + "%",
      opacity: "0.2",
      backgroundColor: "rgb(10, 50, 100)"
    };

    const deleteBubble = (
      <div className="tags_bubble tags_cross" onClick={this.props.deleteTag}>
        <i className="fi-trash" />
      </div>
    );

    const countOrActionBubble = this.props.shoud_display_count ? (
      <div className="tags_bubble tags_count">{this.props.tag_number}</div>
    ) : this.props.node_has_tag ? (
      <div
        className="tags_bubble tags_cross"
        onClick={this.props.removeTagFromNode}
      >
        <i className="fi-x" />
      </div>
    ) : (
      <div className="tags_bubble tags_add" onClick={this.props.addTagToNode}>
        <i className="fi-plus" />
      </div>
    );

    let tag_pill;
    if (this.props.editing) {
      tag_pill = (
        <MultiLinesInput
          value={tag}
          onFinish={value => {
            if (value !== "") {
              this.props.renameTag(value);
            }
            this.props.stopEditingTag();
          }}
          autofocus={true}
        />
      );
    } else {
      tag_pill = (
        <Tag
          text={tag}
          editing={false}
          clickHandler={this.props.startEditingTag}
          removeHandler={() => {}}
        />
      );
    }

    const pencil = this.props.editing ? (
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
        onMouseEnter={this.props.highlightTag}
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
            {tag_pill}
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
