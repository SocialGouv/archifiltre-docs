import React from "react";

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

const BreadcrumbText = props => {
  const { isPlaceholder, text, x, y, dx, dy } = props;
  const availableSpace = 0.8 * dx;
  const fontWidth = 6;
  const normalizedFontWidth =
    text.length * fontWidth < availableSpace ? fontWidth : 0.75 * fontWidth;

  return (
    <text
      className="breadcrumb-text"
      x={x}
      y={y}
      dx="0"
      dy={dy / 2 + 5}
      textAnchor="start"
      stroke="none"
      fontWeight={isPlaceholder ? "bold" : ""}
      fontSize={text.length * fontWidth < availableSpace ? "1em" : "0.7em"}
    >
      {smartClip(text, availableSpace, normalizedFontWidth)}
    </text>
  );
};

export default BreadcrumbText;
