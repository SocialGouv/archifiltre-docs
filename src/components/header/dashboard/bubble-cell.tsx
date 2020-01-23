import React, { FC } from "react";
import TextAlignCenter from "../../common/text-align-center";

const BubbleCell: FC = ({ children }) => (
  <div className="cell small-12">
    <TextAlignCenter>{children}</TextAlignCenter>
  </div>
);

export default BubbleCell;
