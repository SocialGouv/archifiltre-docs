import TablePagination from "@material-ui/core/TablePagination";
import React, { forwardRef, MutableRefObject } from "react";

const Paginator = (
  { pageCount, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage },
  ref: MutableRefObject<HTMLDivElement | null>
) => (
  <TablePagination
    ref={ref}
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

export default forwardRef(Paginator);
