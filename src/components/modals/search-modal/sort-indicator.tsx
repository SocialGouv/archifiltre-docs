import React from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";

export interface SortIndicatorProps {
    column: { isSorted: boolean; isSortedDesc: boolean };
}
// TODO: is this still used ?
export const SortIndicator: React.FC<SortIndicatorProps> = ({ column }) => (
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
