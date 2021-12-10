import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import React, { useState } from "react";

import { COLLAPSE_ICON, EXPAND_ICON, Icon } from "../icon";
import type { RowRendererProps, TableAccessor } from "./table-types";
import { TableValue } from "./table-value";

type HeaderProps<T> = { accessor: TableAccessor<T> }[];

export function makeTableExpandableRow<T>(_headerProps: HeaderProps<T>) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return function TableExpandableRow({
        columns,
        row: rows,
    }: RowRendererProps<T>): React.ReactElement<RowRendererProps<T>> {
        const [expanded, setExpanded] = useState(false);
        const toggleExpanded = () => {
            setExpanded(!expanded);
        };
        const slicedColumns = columns.slice(1);
        return (
            <>
                <TableRow>
                    <TableCell>
                        <Icon
                            icon={expanded ? COLLAPSE_ICON : EXPAND_ICON}
                            color="black"
                            onClick={toggleExpanded}
                            size="normal"
                        />
                    </TableCell>
                    {slicedColumns.map(
                        ({ accessor, id, cellStyle }, columnIndex) => {
                            return (
                                <TableCell
                                    key={`${
                                        id || String(accessor)
                                    }-${columnIndex}`}
                                >
                                    <TableValue
                                        row={rows}
                                        accessor={accessor}
                                        index={0}
                                        cellStyle={cellStyle}
                                    />
                                </TableCell>
                            );
                        }
                    )}
                </TableRow>
                {expanded &&
                    rows instanceof Array &&
                    rows.map((_row, rowIndex) => (
                        <TableRow key={`row-${rowIndex}`}>
                            {columns.map(
                                ({ accessor, id, cellStyle }, columnIndex) => (
                                    <TableCell
                                        key={`${
                                            id || String(accessor)
                                        }-${rowIndex}-${columnIndex}`}
                                    >
                                        <TableValue
                                            index={rowIndex}
                                            row={rows}
                                            accessor={accessor}
                                            cellStyle={cellStyle}
                                        />
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    ))}
            </>
        );
    };
}
