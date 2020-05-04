import React from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

const SortIndicator = ({ column }) => (
  <span>
    {column.isSorted ? (
      column.isSortedDesc ? (
        <FaSortDown style={{ height: "70%" }} />
      ) : (
        <FaSortUp style={{ height: "70%" }} />
      )
    ) : (
      <FaSort style={{ height: "70%" }} />
    )}
  </span>
);

export default SortIndicator;
