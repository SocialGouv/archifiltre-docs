import React from "react";

import * as ObjectUtil from "util/object-util";

const tag_style = {
  color: "white",
  backgroundColor: "rgb(10, 50, 100)",
  borderRadius: "0.5em",
  padding: "0 0.5em"
};

const default_component_style = {
  fontWeight: "bold"
};

const Tag = props => {
  const removeHandler = props.removeHandler;
  const custom_style = props.custom_style;
  const clickHandler = props.clickHandler;
  const text = props.text;
  const editing = props.editing;

  const cross = (
    <div
      className="tags_bubble  tags_cross"
      onMouseUp={e => {
        e.stopPropagation();
        removeHandler();
      }}
    >
      <i className="fi-x" />
    </div>
  );

  const component_style = ObjectUtil.compose(
    custom_style,
    default_component_style
  );

  return (
    <div className="grid-x" style={component_style} onClick={clickHandler}>
      <div className="cell shrink" style={{ paddingRight: "0em" }}>
        <div style={tag_style}>{text}</div>
      </div>
      <div className="cell shrink" style={{ marginLeft: "-0.3em" }}>
        {editing ? cross : <span />}
      </div>
    </div>
  );
};

export default Tag;
