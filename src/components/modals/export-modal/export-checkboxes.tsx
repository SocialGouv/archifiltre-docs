import React, { FC, useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useAuditReport } from "../../../hooks/use-audit-report";
import { useCsvExport } from "../../../hooks/use-csv-export";
import { useMetsExport } from "../../../hooks/use-mets-export";
import { useResipExport } from "../../../hooks/use-resip-export";
import {
  ExportToAuditReport,
  ExportToCsv,
  ExportToMets,
  ExportToResip,
} from "../../common/export-types";

const ExportContainer = styled.div`
  display: flex;
`;

const CheckboxLabel = styled.span`
  color: ${({ isDisabled }) => (isDisabled ? "grey" : "initial")};
`;

interface ExportCheckboxesProps {
  areHashesReady: boolean;
  exportToAuditReport: ExportToAuditReport;
  exportToMets: ExportToMets;
  exportToResip: ExportToResip;
  exportToCsv: ExportToCsv;
  setExportFunctions: (Function) => void;
}

const ExportCheckboxes: FC<ExportCheckboxesProps> = ({
  areHashesReady,
  exportToAuditReport,
  exportToMets,
  exportToResip,
  exportToCsv,
  setExportFunctions,
}) => {
  const auditExport = useAuditReport({
    areHashesReady,
    exportToAuditReport,
  });
  const csvExport = useCsvExport({
    exportToCsv,
    areHashesReady,
    exportWithHashes: false,
  });
  const csvExportWithHashes = useCsvExport({
    exportToCsv,
    areHashesReady,
    exportWithHashes: true,
  });
  const resipExport = useResipExport({
    exportToResip,
  });
  const metsExport = useMetsExport({
    exportToMets,
  });

  const availableExports = useMemo(
    () => [
      {
        id: "audit",
        isChecked: false,
        ...auditExport,
      },
      {
        id: "csv",
        isChecked: false,
        ...csvExport,
      },
      {
        id: "csv-with-hashes",
        isChecked: false,
        ...csvExportWithHashes,
      },
      {
        id: "resip",
        isChecked: false,
        ...resipExport,
      },
      {
        id: "mets",
        isChecked: false,
        ...metsExport,
      },
    ],
    [auditExport, csvExport, csvExportWithHashes, resipExport, metsExport]
  );

  const [exports, setExports] = useState(availableExports);

  const onChange = useCallback(
    (event) => {
      const updatedExports = exports.map((exportType) =>
        exportType.id === event.target.id
          ? { ...exportType, isChecked: event.target.checked }
          : exportType
      );
      setExports(updatedExports);
      setExportFunctions(
        updatedExports
          .filter(({ isChecked }) => isChecked)
          .map(({ exportFunction }) => exportFunction)
      );
    },
    [exports]
  );

  return (
    <>
      {exports.map((exportType) => (
        <ExportContainer key={exportType.id}>
          <label htmlFor={exportType.id}>
            <input
              id={exportType.id}
              type="checkbox"
              checked={exportType.isChecked}
              onChange={onChange}
              disabled={exportType.disabled}
            />
            <CheckboxLabel isDisabled={exportType.disabled}>
              {`${exportType.label}${
                exportType.disabled
                  ? ` (${exportType.disabledExplanation})`
                  : ""
              }`}
            </CheckboxLabel>
          </label>
        </ExportContainer>
      ))}
    </>
  );
};

export default ExportCheckboxes;
