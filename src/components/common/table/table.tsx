import MuiTable from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
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

type TableProps<T> = {
  data: T[];
  columns: Column<T>[];
  rowId: RowIdAccessor<T>;
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
    () => (typeof rowId === "function" ? rowId : (row: T) => row[rowId]),
    [rowId]
  );
  return (
    <div>
      <TableContainer component={Paper}>
        <MuiTable size={isDense ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              {columns.map(({ name }, columnIndex) => (
                <TableCell key={`${name}-${columnIndex}`}>{name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, rowIndex) => (
                <RowRendererComp
                  key={`${rowIdAccessor(row)}-${rowIndex}`}
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

export default memo(Table);
