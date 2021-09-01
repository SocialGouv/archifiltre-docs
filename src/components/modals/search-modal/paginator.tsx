import TablePagination from "@material-ui/core/TablePagination";
import React, { forwardRef, MutableRefObject } from "react";
import { PaginatorActions } from "./paginator-actions";

const Paginator = (
  {
    pageCount,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
    labelRowsPerPage,
  },
  ref: MutableRefObject<HTMLDivElement | null>
) => (
  <TablePagination
    ref={ref}
    rowsPerPageOptions={[10, 25, 50, 100]}
    component="div"
    count={pageCount}
    rowsPerPage={rowsPerPage}
    page={page}
    onChangePage={handleChangePage}
    onChangeRowsPerPage={handleChangeRowsPerPage}
    labelRowsPerPage={labelRowsPerPage}
    labelDisplayedRows={({ from, to, count }) =>
      `${from}-${to === -1 ? count : to}/${count !== -1 ? count : ">" + to}`
    }
    ActionsComponent={PaginatorActions}
  />
);

export default forwardRef(Paginator);
