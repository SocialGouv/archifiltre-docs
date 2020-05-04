import TablePagination from "@material-ui/core/TablePagination";
import React from "react";

const Paginator = ({
  pageCount,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  return (
    <TablePagination
      rowsPerPageOptions={[]}
      component="div"
      count={pageCount}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      labelDisplayedRows={({ from, to, count }) =>
        `${from}-${to === -1 ? count : to}/${count !== -1 ? count : ">" + to}`
      }
    />
  );
};

export default Paginator;
