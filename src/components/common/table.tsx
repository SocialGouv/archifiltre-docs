import { Table as MuiTable } from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { FC, memo, useCallback, useState } from "react";
import Paginator from "../modals/search-modal/paginator";

interface TableProps {
  data: any[];
  columns: any[];
}

const Table: FC<TableProps> = ({ columns, data }) => {
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
        <MuiTable>
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
                  {columns.map(({ accessor }, columnIndex) => (
                    <TableCell key={`${accessor}-${columnIndex}`}>
                      {row[accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </MuiTable>
      </TableContainer>
      <Paginator
        pageCount={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default memo(Table);
