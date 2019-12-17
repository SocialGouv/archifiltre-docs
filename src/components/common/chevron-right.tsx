import React, { FC } from "react";

interface ChevronRightProps {
  color?: string;
}

const ChevronRight: FC<ChevronRightProps> = ({ color = "black" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
    enableBackground="new 0 0 50 50"
    stroke={color}
    fill={color}
  >
    <path d="M22.7 34.7l-1.4-1.4 8.3-8.3-8.3-8.3 1.4-1.4 9.7 9.7z" />
  </svg>
);

export default ChevronRight;
