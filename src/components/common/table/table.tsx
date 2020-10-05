import MuiTable from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import EnhancedTableHead from "components/common/table/enhanced-table-head";
import React, {
  memo,
  ReactElement,
  useCallback,
  useMemo,
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
  getComparator,
  Order,
  stableSort,
} from "util/table/table-util";

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  rowId?: RowIdAccessor<T>;
  isPaginatorDisplayed?: boolean;
  isDense?: boolean;
  RowRendererComp?: RowRenderer<T>;
};

function Table<T>({
  columns,
  data,
  rowId,
  isPaginatorDisplayed = true,
  isDense = false,
  RowRendererComp = TableDefaultRow,
}: TableProps<T>): ReactElement<any, any> | null {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const handleChangePage = useCallback(
    (event: any, newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );
  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [setRowsPerPage, setPage]
  );
  const rowIdAccessor = useMemo(
    () =>
      typeof rowId === "function"
        ? rowId
        : (row: T) => (rowId ? row[rowId] : undefined),
    [rowId]
  );

  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<number>(0);

  const sortedColumnAccessor = useMemo(
    () => accessorToFunction(columns[orderBy].accessor),
    [columns, orderBy]
  );

  const handleRequestSort = (event: React.MouseEvent, property: number) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const comparator = getComparator(order, sortedColumnAccessor);
  const sortedData = stableSort<T>(data, comparator);

  return (
    <div>
      <TableContainer component={Paper}>
        <MuiTable size={isDense ? "small" : "medium"}>
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            columns={columns}
          />
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
          pageCount={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          handleChangePage={handleChangePage}
          handleChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
}

export default memo(Table) as typeof Table;
