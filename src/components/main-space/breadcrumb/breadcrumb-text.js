import React from "react";

const breadcrumbTextStyle = {
  paddingRight: "5px",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

const smartClip = (text, availableSpace, fontWidth) => {
  const targetSize = Math.floor(availableSpace / fontWidth);
  const slice = Math.floor(targetSize / 2);

  if (text.length > targetSize) {
    return (
      text.substring(0, slice - 2) +
      "..." +
      text.substring(text.length - slice + 2, text.length)
    );
  }
  return text;
};

const BreadcrumbText = (props) => {
  const { text, dx } = props;
  const availableSpace = 0.8 * dx;
  const fontWidth = 6;
  const normalizedFontWidth =
    text.length * fontWidth < availableSpace ? fontWidth : 0.75 * fontWidth;

  return (
    <div style={breadcrumbTextStyle}>
      {smartClip(text, availableSpace, normalizedFontWidth)}
    </div>
  );
};

export default BreadcrumbText;
