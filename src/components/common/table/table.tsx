import MuiTable from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import EnhancedTableHead from "components/common/table/enhanced-table-head";
import React, {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Paginator from "components/modals/search-modal/paginator";
import {
  Column,
  RowIdAccessor,
  RowRenderer,
} from "components/common/table/table-types";
import TableDefaultRow from "components/common/table/table-default-row";
import {
  accessorToFunction,
  limitPageIndex,
  getComparator,
  Order,
  stableSort,
} from "util/table/table-util";
import { useElementHeight } from "hooks/use-element-height";
import { useControllableValue } from "../../../hooks/use-controllable-value";
import { useTranslation } from "react-i18next";
import { useDuplicatePageState } from "context/duplicates-page-context";

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  rowId?: RowIdAccessor<T>;
  isPaginatorDisplayed?: boolean;
  isDense?: boolean;
  RowRendererComp?: RowRenderer<T>;
  stickyHeader?: boolean;
  page?: number;
  onPageChange?: (page: number) => void;
};

function Table<T>({
  columns,
  data,
  rowId,
  isPaginatorDisplayed = true,
  isDense = false,
  RowRendererComp = TableDefaultRow,
  stickyHeader = false,
  page,
  onPageChange,
}: TableProps<T>): ReactElement<any, any> | null {
  const { t } = useTranslation();

  // const [rowsPerPage, setRowsPerPage] = useState(10);
  const { rowsPerPage, setRowsPerPage } = useDuplicatePageState();
  const [innerPage, setInnerPage] = useControllableValue(0, page, onPageChange);
  const handleChangePage = useCallback(
    (event: any, newPage: number) => {
      setInnerPage(newPage);
    },
    [setInnerPage]
  );
  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setInnerPage(0);
    },
    [setRowsPerPage, setInnerPage]
  );
  const rowIdAccessor = useMemo(
    () =>
      typeof rowId === "function"
        ? rowId
        : (row: T) => (rowId ? row[rowId] : undefined),
    [rowId]
  );

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<number>(-1);

  const sortedColumnAccessor = useMemo(() => {
    const sortAccessor =
      columns[orderBy]?.sortAccessor ||
      columns[orderBy]?.accessor ||
      (() => "");
    return accessorToFunction(sortAccessor);
  }, [columns, orderBy]);

  const handleRequestSort = (event: React.MouseEvent, property: number) => {
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
    tableContainerRef?.current?.scrollTo(0, 0);
  }, [innerPage]);

  return (
    <div ref={tableRef} style={containerStyle}>
      <TableContainer
        component={Paper}
        style={tableContainerStyle}
        ref={tableContainerRef}
      >
        <MuiTable
          size={isDense ? "small" : "medium"}
          stickyHeader={stickyHeader}
        >
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            columns={columns}
          />
          <TableBody>
            {sortedData
              .slice(
                innerPage * rowsPerPage,
                innerPage * rowsPerPage + rowsPerPage
              )
              .map((row, rowIndex) => (
                <RowRendererComp
                  key={`${rowIdAccessor(row) || rowIndex}`}
                  row={row}
                  columns={columns}
                />
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
}

export default memo(Table) as typeof Table;
