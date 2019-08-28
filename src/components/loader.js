import React from "react";

const baseLoaderStyle = {
  width: "2em",
  height: "2em",
  backgroundSize: "contain"
};

const loadingStyle = {
  ...baseLoaderStyle,
  backgroundImage: `url("imgs/loading-spinner.gif")`
};

const loadedStyle = {
  ...baseLoaderStyle,
  backgroundImage: `url("imgs/check.png")`
};

/**
 * Simple component that displays a loader when loading is true and a check when loading is false.
 * @param loading
 */
const Loader = ({ loading }) => (
  <div style={loading ? loadingStyle : loadedStyle}></div>
);

export default Loader;
