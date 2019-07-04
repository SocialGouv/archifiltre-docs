import React from "react";

const progressBarStyle = {
  display: "inline-block",
  height: "20px",
  width: "300px",
  backgroundColor: "#f5f5f5",
  borderRadius: "4px",
  boxShadow: "inset 0 1px 2px"
};

const fillerStyle = {
  float: "left",
  width: "0",
  height: "100%",
  fontSize: "12px",
  lineHeight: "20px",
  borderRadius: "4px",
  color: "#fff",
  textAlign: "center",
  backgroundColor: "#337ab7",
  boxShadow: "inset 0 -1px 0 rgba(0,0,0,.15)",
  transition: "width .6s ease"
};

const ProgressBar = ({ percentage }) => {
  const fillerFullStyle = { ...fillerStyle, width: `${percentage}%` };
  return (
    <div style={progressBarStyle}>
      <div style={fillerFullStyle}>{Math.ceil(percentage)}%</div>
    </div>
  );
};

export default ProgressBar;
