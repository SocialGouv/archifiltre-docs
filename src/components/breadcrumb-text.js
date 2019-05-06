import React from "react";

const smartClip = (s, w, fw) => {
  const target_size = Math.floor(w / fw);
  const slice = Math.floor(target_size / 2);

  if (s.length > target_size) {
    return (
      s.substring(0, slice - 2) +
      "..." +
      s.substring(s.length - slice + 2, s.length)
    );
  } else {
    return s;
  }
};

const BreadcrumbText = props => {
  const available_space = 0.8 * props.dx;
  const font_width = 6;

  return (
    <text
      className="breadcrumb-text"
      x={props.x}
      y={props.y}
      dx="0"
      dy={props.dy / 2 + 5}
      textAnchor="start"
      stroke="none"
      fontWeight={props.is_placeholder ? "bold" : ""}
      fontSize={
        props.text.length * font_width < available_space ? "1em" : "0.7em"
      }
    >
      {props.text.length * font_width < available_space
        ? smartClip(props.text, available_space, font_width)
        : smartClip(props.text, available_space, 0.75 * font_width)}
    </text>
  );
};

export default BreadcrumbText;
