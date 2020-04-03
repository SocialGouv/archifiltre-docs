import React, { FC } from "react";

import TagBadge from "./tag-badge";
import { FaTimes } from "react-icons/fa";

interface TagProps {
  removeHandler: () => void;
  custom_style: any;
  clickHandler: any;
  text: string;
  editing: boolean;
}

const Tag: FC<TagProps> = ({
  removeHandler,
  custom_style: customStyle,
  clickHandler,
  text,
  editing,
}) => {
  const cross = (
    <div
      className="tags_bubble tags_cross"
      onMouseUp={(e) => {
        e.stopPropagation();
        removeHandler();
      }}
    >
      <FaTimes style={{ width: "50%", height: "50%" }} />
    </div>
  );

  const componentStyle = {
    fontWeight: "bold",
    ...customStyle,
  };

  return (
    <div className="grid-x" style={componentStyle} onClick={clickHandler}>
      <TagBadge>{text}</TagBadge>
      <div className="cell shrink" style={{ marginLeft: "-0.3em" }}>
        {editing ? cross : <span />}
      </div>
    </div>
  );
};

export default Tag;
