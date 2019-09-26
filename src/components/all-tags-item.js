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
    let res;

    let tag = this.props.tag;

    let component_style = {
      position: "relative",
      width: "100%",
      background: "none",
      margin: "0",
      padding: "4px 0.5em"
    };

    let content_style = {
      opacity: this.props.opacity,
      position: "relative",
      zIndex: "1"
    };

    let background_style = {
      transition: "all 0.4s",
      WebkitTransition: "all 0.4s",
      height: "100%",
      width: this.props.percentage + "%",
      opacity: "0.2",
      backgroundColor: "rgb(10, 50, 100)"
    };

    let delete_bubble = (
      <div className="tags_bubble tags_cross" onClick={this.props.deleteTag}>
        <i className="fi-trash" />
      </div>
    );

    let count_or_action_bubble = this.props.shoud_display_count ? (
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

    let pencil = this.props.editing ? (
      <span />
    ) : (
      <i
        className="fi-pencil edit_hover_pencil"
        style={{ opacity: "0.3", paddingLeft: "0.4em" }}
      />
    );

    res = (
      <div
        className="edit_hover_container"
        onMouseEnter={this.props.highlightTag}
        style={component_style}
      >
        <div className="grid-x" style={content_style}>
          <div className="cell shrink" style={cell_shrink_style}>
            {delete_bubble}
          </div>
          <div className="cell shrink" style={cell_shrink_style}>
            {count_or_action_bubble}
          </div>
          <div className="cell auto" style={cell_shrink_style}>
            {tag_pill}
          </div>
          <div className="cell shrink" style={cell_shrink_style}>
            {pencil}
          </div>
        </div>
        <div className="background" style={background_style} />
      </div>
    );

    return res;
  }
}

export default AllTagsItem;
