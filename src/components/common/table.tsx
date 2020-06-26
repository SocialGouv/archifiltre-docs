import MuiTable from "@material-ui/core/Table";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { FC, memo, useCallback, useState } from "react";
import Paginator from "../modals/search-modal/paginator";
import TableValue from "./table-value";

interface TableProps {
  data: any[];
  columns: any[];
  isPaginatorDisplayed?: boolean;
  isDense?: boolean;
}

const Table: FC<TableProps> = ({
  columns,
  data,
  isPaginatorDisplayed = true,
  isDense = false,
}) => {
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
                <TableRow key={`${row.name}-${rowIndex}`}>
                  {columns.map(({ accessor, id }, columnIndex) => (
                    <TableCell key={`${id || accessor}-${columnIndex}`}>
                      <TableValue row={row} column={columns[columnIndex]} />
                    </TableCell>
                  ))}
                </TableRow>
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
};

export default memo(Table);
