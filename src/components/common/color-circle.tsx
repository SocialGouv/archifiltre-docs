import React from "react";
import { FaCircle } from "react-icons/fa";

export interface ColorCircleProps {
  color: string;
}

export const ColorCircle: React.FC<ColorCircleProps> = ({ color }) => (
  <FaCircle
    style={{
      color,
      height: "10px",
      paddingLeft: "8px",
      verticalAlign: "middle",
    }}
  />
);
