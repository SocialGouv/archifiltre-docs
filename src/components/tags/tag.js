import React from "react";

import * as ObjectUtil from "util/object-util";

const tagStyle = {
  color: "white",
  backgroundColor: "rgb(10, 50, 100)",
  borderRadius: "0.5em",
  padding: "0 0.5em"
};

const defaultComponentStyle = {
  fontWeight: "bold"
};

const Tag = ({ removeHandler, custom_style, clickHandler, text, editing }) => {
  const cross = (
    <div
      className="tags_bubble tags_cross"
      onMouseUp={e => {
        e.stopPropagation();
        removeHandler();
      }}
    >
      <i className="fi-x" />
    </div>
  );

  const componentStyle = ObjectUtil.compose(
    custom_style,
    defaultComponentStyle
  );

  return (
    <div className="grid-x" style={componentStyle} onClick={clickHandler}>
      <div
        className="cell auto"
        style={{ paddingRight: "0em", wordBreak: "break-word" }}
      >
        <div style={tagStyle}>{text}</div>
      </div>
      <div className="cell shrink" style={{ marginLeft: "-0.3em" }}>
        {editing ? cross : <span />}
      </div>
    </div>
  );
};

export default Tag;
