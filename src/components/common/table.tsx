import React, { FC, memo } from "react";
import { Column, usePagination, useSortBy, useTable } from "react-table";
import Paginator from "../modals/search-modal/paginator";
import SortIndicator from "../modals/search-modal/sort-indicator";
import { AggregatedTableInstance, AggregatedTableState } from "./table-types";

interface TableProps {
  data: any[];
  columns: Column<object>[];
}

const Table: FC<TableProps> = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state,
  } = useTable<object>(
    {
      columns,
      data,
    },
    useSortBy,
    usePagination
  ) as AggregatedTableInstance<object>;

  const { pageIndex } = state as AggregatedTableState<object>;

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  style={{ maxWidth: column.maxWidth }}
                  // @ts-ignore
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  {/*
                    // @ts-ignore */}
                  <SortIndicator column={column} />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    // @ts-ignore
                    <td
                      style={{
                        maxWidth: cell.column.maxWidth,
                        wordWrap: "break-word",
                      }}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <Paginator
        gotoPage={gotoPage}
        canPreviousPage={canPreviousPage}
        previousPage={previousPage}
        nextPage={nextPage}
        canNextPage={canNextPage}
        pageCount={pageCount}
        pageIndex={pageIndex}
        pageOptions={pageOptions}
      />
    </div>
  );
};

export default memo(Table);
