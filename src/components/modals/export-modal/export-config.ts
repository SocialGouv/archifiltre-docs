import _ from "lodash";
import path from "path";

import { auditReportExporterThunk } from "../../../exporters/audit/audit-report-exporter";
import { csvExporterThunk } from "../../../exporters/csv/csv-exporter";
import { treeCsvExporterThunk } from "../../../exporters/csv/tree-csv-exporter";
import { deletionScriptExporterThunk } from "../../../exporters/deletion-script/deletion-script-exporter";
import { excelExporterThunk } from "../../../exporters/excel/excel-exporter";
import { metsExporterThunk } from "../../../exporters/mets/mets-export-thunk";
import { resipExporterThunk } from "../../../exporters/resip/resip-exporter-thunk";
import { ActionTitle } from "../../../logging/tracker-types";
import type { ArchifiltreThunkAction } from "../../../reducers/archifiltre-types";
import { getNameWithExtension } from "../../../util/file-system/file-sys-util";
import { isWindows } from "../../../util/os/os-util";
import type { ExportTypesMap } from "../export-modal/export-options";

/* eslint-disable @typescript-eslint/naming-convention */
export enum ExportType {
  EXCEL = "EXCEL",
  CSV = "CSV",
  CSV_WITH_HASHES = "CSV_WITH_HASHES",
  TREE_CSV = "TREE_CSV",
  AUDIT = "AUDIT",
  RESIP = "RESIP",
  METS = "METS",
  DELETION_SCRIPT = "DELETION",
}

export enum ExportCategory {
  RECORDS_INVENTORY = "RECORDS_INVENTORY",
  AUDIT = "AUDIT",
  EXCHANGE_WITH_ERMS = "EXCHANGE_WITH_ERMS",
  UTILITIES = "UTILITIES",
}
/* eslint-enable @typescript-eslint/naming-convention */

export interface IsActiveOptions {
  areHashesReady: boolean;
}

interface ExportConfig {
  isActive: boolean | ((options: IsActiveOptions) => boolean);
  label: string;
  exportFunction: (exportPath: string) => ArchifiltreThunkAction;
  disabledExplanation?: string;
  exportPath: (originalPath: string, sessionName: string) => string;
  isFilePickerDisabled?: boolean;
  category: ExportCategory;
  trackingTitle: ActionTitle;
}

type ExportConfigMap = {
  [exportType in ExportType]: ExportConfig;
};

export const mapValuesFromExportType = <T>(
  iteratee: (value: ExportType) => T
): ExportTypesMap<T> => {
  return _(ExportType)
    .values()
    .keyBy()
    .mapValues(iteratee)
    .value() as ExportTypesMap<T>;
};

const exportFilesConfigs = {
  [ExportType.AUDIT]: { extension: "docx", fileSuffix: "audit" },
  [ExportType.CSV]: { extension: "csv", fileSuffix: "csv" },
  [ExportType.CSV_WITH_HASHES]: {
    extension: "csv",
    fileSuffix: "csvWithHashes",
  },
  [ExportType.TREE_CSV]: { extension: "csv", fileSuffix: "treeCsv" },
  [ExportType.RESIP]: { extension: "csv", fileSuffix: "resip" },
  [ExportType.METS]: { extension: "zip", fileSuffix: "mets" },
  [ExportType.EXCEL]: { extension: "xlsx", fileSuffix: "excel" },
  [ExportType.DELETION_SCRIPT]: {
    extension: isWindows() ? "ps1" : "sh",
    fileSuffix: "delete",
  },
};

const computeExportFilePath = (
  originalPath: string,
  sessionName: string,
  exportId: ExportType
) => {
  const { fileSuffix, extension } = exportFilesConfigs[exportId];
  return path.join(
    originalPath,
    "..",
    getNameWithExtension(`${sessionName}-${fileSuffix}`, extension)
  );
};

export const exportConfig: ExportConfigMap = {
  [ExportType.AUDIT]: {
    category: ExportCategory.AUDIT,
    disabledExplanation: "header.csvWithHashDisabledMessage",
    exportFunction(exportPath) {
      return auditReportExporterThunk(exportPath);
    },
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.AUDIT),
    isActive: ({ areHashesReady }) => areHashesReady,
    label: "header.auditReport",
    trackingTitle: ActionTitle.AUDIT_REPORT_EXPORT,
  },
  [ExportType.CSV]: {
    category: ExportCategory.RECORDS_INVENTORY,
    exportFunction(exportPath) {
      return csvExporterThunk(exportPath);
    },
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.CSV),
    isActive: true,
    label: "CSV",
    trackingTitle: ActionTitle.CSV_EXPORT,
  },
  [ExportType.CSV_WITH_HASHES]: {
    category: ExportCategory.RECORDS_INVENTORY,
    disabledExplanation: "header.csvWithHashDisabledMessage",
    exportFunction: (exportPath) =>
      csvExporterThunk(exportPath, { withHashes: true }),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(
        originalPath,
        sessionName,
        ExportType.CSV_WITH_HASHES
      ),
    isActive: ({ areHashesReady }) => areHashesReady,
    label: "header.csvWithHash",
    trackingTitle: ActionTitle.CSV_WITH_HASHES_EXPORT,
  },
  [ExportType.TREE_CSV]: {
    category: ExportCategory.RECORDS_INVENTORY,
    exportFunction: (exportPath) => treeCsvExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.TREE_CSV),
    isActive: true,
    label: "export.treeCsv",
    trackingTitle: ActionTitle.TREE_CSV_EXPORT,
  },
  [ExportType.EXCEL]: {
    category: ExportCategory.RECORDS_INVENTORY,
    disabledExplanation: "header.csvWithHashDisabledMessage",
    exportFunction: (exportPath) => excelExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.EXCEL),
    isActive: ({ areHashesReady }) => areHashesReady,
    label: "Excel",
    trackingTitle: ActionTitle.EXCEL_EXPORT,
  },
  [ExportType.RESIP]: {
    category: ExportCategory.EXCHANGE_WITH_ERMS,
    exportFunction: (exportPath) => resipExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) => {
      const { fileSuffix, extension } = exportFilesConfigs[ExportType.RESIP];
      return path.join(
        originalPath,
        getNameWithExtension(`${sessionName}-${fileSuffix}`, extension)
      );
    },
    isActive: true,
    isFilePickerDisabled: true,
    label: "RESIP",
    trackingTitle: ActionTitle.RESIP_EXPORT,
  },
  [ExportType.METS]: {
    category: ExportCategory.EXCHANGE_WITH_ERMS,
    exportFunction: (exportPath) => metsExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.METS),
    isActive: true,
    label: "METS (beta)",
    trackingTitle: ActionTitle.METS_EXPORT,
  },
  [ExportType.DELETION_SCRIPT]: {
    category: ExportCategory.UTILITIES,
    exportFunction: (exportPath) => deletionScriptExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(
        originalPath,
        sessionName,
        ExportType.DELETION_SCRIPT
      ),
    isActive: true,
    label: "export.deletionScript",
    trackingTitle: ActionTitle.DELETION_SCRIPT,
  },
};
