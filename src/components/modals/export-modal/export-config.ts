import { ExportTypesMap } from "components/modals/export-modal/export-options";
import { csvExporterThunk } from "exporters/csv/csv-exporter";
import { treeCsvExporterThunk } from "exporters/csv/tree-csv-exporter";
import _ from "lodash";
import path from "path";
import { auditReportExporterThunk } from "exporters/audit/audit-report-exporter";
import { metsExporterThunk } from "exporters/mets/mets-export-thunk";
import { resipExporterThunk } from "exporters/resip/resip-exporter-thunk";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { getNameWithExtension } from "util/file-system/file-sys-util";
import { excelExporterThunk } from "exporters/excel/excel-exporter";
import { ActionTitle } from "logging/tracker-types";
import { isWindows } from "util/os/os-util";
import { deletionScriptExporterThunk } from "exporters/deletion-script/deletion-script-exporter";

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

export type IsActiveOptions = {
  areHashesReady: boolean;
};

type ExportConfig = {
  isActive: boolean | ((options: IsActiveOptions) => boolean);
  label: string;
  exportFunction: (exportPath: string) => ArchifiltreThunkAction;
  disabledExplanation?: string;
  exportPath: (originalPath: string, sessionName: string) => string;
  isFilePickerDisabled?: boolean;
  category: ExportCategory;
  trackingTitle: ActionTitle;
};

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
  [ExportType.AUDIT]: { fileSuffix: "audit", extension: "docx" },
  [ExportType.CSV]: { fileSuffix: "csv", extension: "csv" },
  [ExportType.CSV_WITH_HASHES]: {
    fileSuffix: "csvWithHashes",
    extension: "csv",
  },
  [ExportType.TREE_CSV]: { fileSuffix: "treeCsv", extension: "csv" },
  [ExportType.RESIP]: { fileSuffix: "resip", extension: "csv" },
  [ExportType.METS]: { fileSuffix: "mets", extension: "zip" },
  [ExportType.EXCEL]: { fileSuffix: "excel", extension: "xlsx" },
  [ExportType.DELETION_SCRIPT]: {
    fileSuffix: "delete",
    extension: isWindows() ? "ps1" : "sh",
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
    isActive: ({ areHashesReady }) => areHashesReady,
    label: "header.auditReport",
    exportFunction: (exportPath) => auditReportExporterThunk(exportPath),
    disabledExplanation: "header.csvWithHashDisabledMessage",
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.AUDIT),
    category: ExportCategory.AUDIT,
    trackingTitle: ActionTitle.AUDIT_REPORT_EXPORT,
  },
  [ExportType.CSV]: {
    isActive: true,
    label: "CSV",
    exportFunction: (exportPath) => csvExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.CSV),
    category: ExportCategory.RECORDS_INVENTORY,
    trackingTitle: ActionTitle.CSV_EXPORT,
  },
  [ExportType.CSV_WITH_HASHES]: {
    isActive: ({ areHashesReady }) => areHashesReady,
    label: "header.csvWithHash",
    exportFunction: (exportPath) =>
      csvExporterThunk(exportPath, { withHashes: true }),
    disabledExplanation: "header.csvWithHashDisabledMessage",
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(
        originalPath,
        sessionName,
        ExportType.CSV_WITH_HASHES
      ),
    category: ExportCategory.RECORDS_INVENTORY,
    trackingTitle: ActionTitle.CSV_WITH_HASHES_EXPORT,
  },
  [ExportType.TREE_CSV]: {
    isActive: true,
    label: "export.treeCsv",
    exportFunction: (exportPath) => treeCsvExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.TREE_CSV),
    category: ExportCategory.RECORDS_INVENTORY,
    trackingTitle: ActionTitle.TREE_CSV_EXPORT,
  },
  [ExportType.EXCEL]: {
    isActive: ({ areHashesReady }) => areHashesReady,
    label: "Excel",
    disabledExplanation: "header.csvWithHashDisabledMessage",
    exportFunction: (exportPath) => excelExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.EXCEL),
    category: ExportCategory.RECORDS_INVENTORY,
    trackingTitle: ActionTitle.EXCEL_EXPORT,
  },
  [ExportType.RESIP]: {
    isActive: true,
    label: "RESIP",
    exportFunction: (exportPath) => resipExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) => {
      const { fileSuffix, extension } = exportFilesConfigs[ExportType.RESIP];
      return path.join(
        originalPath,
        getNameWithExtension(`${sessionName}-${fileSuffix}`, extension)
      );
    },
    isFilePickerDisabled: true,
    category: ExportCategory.EXCHANGE_WITH_ERMS,
    trackingTitle: ActionTitle.RESIP_EXPORT,
  },
  [ExportType.METS]: {
    isActive: true,
    label: "METS (beta)",
    exportFunction: (exportPath) => metsExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.METS),
    category: ExportCategory.EXCHANGE_WITH_ERMS,
    trackingTitle: ActionTitle.METS_EXPORT,
  },
  [ExportType.DELETION_SCRIPT]: {
    isActive: true,
    label: "export.deletionScript",
    exportFunction: (exportPath) => deletionScriptExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(
        originalPath,
        sessionName,
        ExportType.DELETION_SCRIPT
      ),
    category: ExportCategory.UTILITIES,
    trackingTitle: ActionTitle.DELETION_SCRIPT,
  },
};
