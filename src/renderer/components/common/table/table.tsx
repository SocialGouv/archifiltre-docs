import Paper from "@mui/material/Paper";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useDuplicatePageState } from "../../../context/duplicates-page-context";
import { useControllableValue } from "../../../hooks/use-controllable-value";
import { useElementHeight } from "../../../hooks/use-element-height";
import { accessorToFunction, getComparator, limitPageIndex, type Order, stableSort } from "../../../utils/table";
import { Paginator } from "../../modals/search-modal/paginator";
import { EnhancedTableHead } from "./enhanced-table-head";
import { TableDefaultRow } from "./table-default-row";
import { type Column, type RowIdAccessor, type RowRenderer } from "./table-types";

export interface TableProps<T> {
  RowRendererComp?: RowRenderer<T>;
  columns: Array<Column<T>>;
  data: T[];
  isDense?: boolean;
  isPaginatorDisplayed?: boolean;
  onPageChange?: (page: number) => void;
  page?: number;
  rowId?: RowIdAccessor<T>;
  stickyHeader?: boolean;
}

const _Table = <T,>({
  columns,
  data,
  rowId,
  isPaginatorDisplayed = true,
  isDense = false,

  RowRendererComp = TableDefaultRow,
  stickyHeader = false,
  page,
  onPageChange,
}: TableProps<T>): React.ReactElement<TableProps<T>> => {
  const { t } = useTranslation();

  const { rowsPerPage, setRowsPerPage } = useDuplicatePageState();
  const [innerPage, setInnerPage] = useControllableValue(0, page, onPageChange);
  const handleChangePage = useCallback(
    (_event: unknown, newPage: number) => {
      setInnerPage(newPage);
    },
    [setInnerPage],
  );
  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setInnerPage(0);
    },
    [setRowsPerPage, setInnerPage],
  );
  const rowIdAccessor = useMemo(
    () => (typeof rowId === "function" ? rowId : (row: T) => (rowId ? row[rowId] : undefined)),
    [rowId],
  );

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<number>(-1);

  const sortedColumnAccessor = useMemo(() => {
    const sortAccessor = columns[orderBy]?.sortAccessor ?? (columns[orderBy]?.accessor || (() => ""));
    return accessorToFunction(sortAccessor);
  }, [columns, orderBy]);

  const handleRequestSort = (_event: unknown, property: number) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const comparator = getComparator(order, sortedColumnAccessor);
  const sortedData = stableSort<T>(data, comparator);

  const tableRef = useRef<HTMLDivElement | null>(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);

  const tableHeight = useElementHeight(tableRef);
  const paginationHeight = useElementHeight(paginationRef);

  const containerStyle = stickyHeader ? { height: "100%" } : {};

  const tableContainerStyle = stickyHeader
    ? {
        maxHeight: `${tableHeight - paginationHeight}px`,
      }
    : {};

  useEffect(() => {
    setInnerPage(limitPageIndex(rowsPerPage, data.length, innerPage));
  }, [data.length, setInnerPage, innerPage, rowsPerPage]);

  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    tableContainerRef.current?.scrollTo(0, 0);
  }, [innerPage]);

  return (
    <div ref={tableRef} style={containerStyle}>
      <TableContainer component={Paper} style={tableContainerStyle} ref={tableContainerRef}>
        <MuiTable size={isDense ? "small" : "medium"} stickyHeader={stickyHeader}>
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} columns={columns} />
          <TableBody>
            {sortedData.slice(innerPage * rowsPerPage, innerPage * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
              <RowRendererComp key={`${rowIdAccessor(row) ?? rowIndex}`} row={row} columns={columns} />
            ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {isPaginatorDisplayed && (
        <Paginator
          ref={paginationRef}
          pageCount={data.length}
          rowsPerPage={rowsPerPage}
          page={innerPage}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
          labelRowsPerPage={t("common.rowsPerPage")}
        />
      )}
    </div>
  );
};

export const Table = memo(_Table) as typeof _Table;
