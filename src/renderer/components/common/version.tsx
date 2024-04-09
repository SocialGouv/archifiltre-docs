import React, { type CSSProperties } from "react";

import { version, versionName } from "../../version";

export const Version: React.FC = () => {
  const style: CSSProperties = {
    fontSize: "10px",
    margin: "0 0 10px",
    textAlign: "center",
  };
  return (
    <div className="version" style={style}>
      {`v${version} ${versionName}`}
    </div>
  );
};
