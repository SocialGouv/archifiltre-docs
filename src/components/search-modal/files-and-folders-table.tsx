import React from "react";
import translations from "../../translations/translations";
import { useTable } from "react-table";
import { getType } from "../../util/file-and-folders-utils";
import { octet2HumanReadableFormat } from "../main-space/ruler";
import dateFormat from "dateformat";

const columns = [
  {
    Header: translations.t("search.name"),
    accessor: "name"
  },
  {
    Header: translations.t("search.type"),
    accessor: "type"
  },
  {
    Header: translations.t("search.size"),
    accessor: "fileSize"
  },
  {
    Header: translations.t("search.fileLastModified"),
    accessor: "lastModified"
  },
  {
    Header: translations.t("search.path"),
    accessor: "path"
  }
];

type FilesAndFoldersTableItem = {
  name: string;
  type: string;
  file_size: string;
  file_last_modified: string;
  id: string;
};

const getData = filesAndFolders =>
  Object.values(filesAndFolders)
    .filter(({ id }) => id)
    .map((fileOrFolder: FilesAndFoldersTableItem) => {
      return {
        name: fileOrFolder.name,
        fileSize: octet2HumanReadableFormat(fileOrFolder.file_size),
        lastModified: dateFormat(fileOrFolder.file_last_modified, "dd/mm/yyyy"),
        path: fileOrFolder.id,
        type: getType(fileOrFolder)
      };
    });

export const FilesAndFoldersTable = ({ filesAndFolders }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({
    columns,
    data: getData(filesAndFolders)
  });
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
