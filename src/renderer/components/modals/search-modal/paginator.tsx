import TablePagination, { type TablePaginationProps } from "@mui/material/TablePagination";
import React, { forwardRef } from "react";

import { PaginatorActions } from "./paginator-actions";

export interface PaginatorProps {
  handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => void;
  handleChangeRowsPerPage: TablePaginationProps["onChangeRowsPerPage"];
  labelRowsPerPage: TablePaginationProps["labelRowsPerPage"];
  page: TablePaginationProps["page"];
  pageCount: TablePaginationProps["count"];
  rowsPerPage: TablePaginationProps["rowsPerPage"];
}
const _Paginator: React.ForwardRefRenderFunction<HTMLDivElement, PaginatorProps> = (
  { pageCount, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage, labelRowsPerPage },
  ref: React.ForwardedRef<HTMLDivElement | null>,
) => (
  <TablePagination
    ref={ref}
    rowsPerPageOptions={[10, 25, 50, 100]}
    component="div"
    count={pageCount}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    labelRowsPerPage={labelRowsPerPage}
    labelDisplayedRows={({ from, to, count }) => `${from}-${to === -1 ? count : to}/${count !== -1 ? count : `>${to}`}`}
    ActionsComponent={PaginatorActions}
  />
);

_Paginator.displayName = "Paginator";

export const Paginator = forwardRef(_Paginator);
