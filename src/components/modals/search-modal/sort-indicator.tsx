import React, { FC } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { AggregatedColumn } from "../../common/table-types";

interface SortIndicatorProps {
  column: AggregatedColumn<object>;
}

const SortIndicator: FC<SortIndicatorProps> = ({ column }) => (
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
