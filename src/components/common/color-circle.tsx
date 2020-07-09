import React, { FC } from "react";
import { FaCircle } from "react-icons/fa";

type ColorCircleProps = {
  color: string;
};

const ColorCircle: FC<ColorCircleProps> = ({ color }) => (
  <FaCircle
    style={{
      color,
      verticalAlign: "middle",
      height: "10px",
      paddingLeft: "8px",
    }}
  />
);

export default ColorCircle;
