import { ExportCategory, ExportType } from "@common/export/type";
import { isWindows } from "@common/utils/os";
import _ from "lodash";
import path from "path";

import { auditReportExporterThunk } from "../../../exporters/audit/audit-report-exporter";
import { csvExporterThunk } from "../../../exporters/csv/csv-exporter";
import { treeCsvExporterThunk } from "../../../exporters/csv/tree-csv-exporter";
import { deletionScriptExporterThunk } from "../../../exporters/deletion-script/deletion-script-exporter";
import { excelExporterThunk } from "../../../exporters/excel/excel-exporter";
import { metsExporterThunk } from "../../../exporters/mets/mets-export-thunk";
import { resipExporterThunk } from "../../../exporters/resip/resip-exporter-thunk";
import { type ArchifiltreDocsThunkAction } from "../../../reducers/archifiltre-types";
import { getNameWithExtension } from "../../../utils/file-system/file-sys-util";
import { type ExportTypesMap } from "./export-options";

export interface IsActiveOptions {
  areHashesReady: boolean;
}

interface ExportConfig {
  category: ExportCategory;
  disabledExplanation?: string;
  exportFunction: (exportPath: string) => ArchifiltreDocsThunkAction;
  exportPath: (originalPath: string, sessionName: string) => string;
  isActive: boolean | ((options: IsActiveOptions) => boolean);
  isFilePickerDisabled?: boolean;
  label: string;
}

type ExportConfigMap = {
  [exportType in ExportType]: ExportConfig;
};

export const mapValuesFromExportType = <T>(iteratee: (value: ExportType) => T): ExportTypesMap<T> => {
  return _(ExportType).values().keyBy().mapValues(iteratee).value() as ExportTypesMap<T>;
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

const computeExportFilePath = (originalPath: string, sessionName: string, exportId: ExportType) => {
  const { fileSuffix, extension } = exportFilesConfigs[exportId];
  return path.join(originalPath, "..", getNameWithExtension(`${sessionName}-${fileSuffix}`, extension));
};

export const exportConfig: ExportConfigMap = {
  [ExportType.AUDIT]: {
    category: ExportCategory.AUDIT,
    disabledExplanation: "header.csvWithHashDisabledMessage",
    exportFunction(exportPath) {
      return auditReportExporterThunk(exportPath);
    },
    exportPath: (originalPath, sessionName) => computeExportFilePath(originalPath, sessionName, ExportType.AUDIT),
    isActive: ({ areHashesReady }) => areHashesReady,
    label: "header.auditReport",
  },
  [ExportType.CSV]: {
    category: ExportCategory.RECORDS_INVENTORY,
    exportFunction(exportPath) {
      return csvExporterThunk(exportPath);
    },
    exportPath: (originalPath, sessionName) => computeExportFilePath(originalPath, sessionName, ExportType.CSV),
    isActive: true,
    label: "CSV",
  },
  [ExportType.CSV_WITH_HASHES]: {
    category: ExportCategory.RECORDS_INVENTORY,
    disabledExplanation: "header.csvWithHashDisabledMessage",
    exportFunction: exportPath => csvExporterThunk(exportPath, { withHashes: true }),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.CSV_WITH_HASHES),
    isActive: ({ areHashesReady }) => areHashesReady,
    label: "header.csvWithHash",
  },
  [ExportType.TREE_CSV]: {
    category: ExportCategory.RECORDS_INVENTORY,
    exportFunction: exportPath => treeCsvExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) => computeExportFilePath(originalPath, sessionName, ExportType.TREE_CSV),
    isActive: true,
    label: "export.treeCsv",
  },
  [ExportType.EXCEL]: {
    category: ExportCategory.RECORDS_INVENTORY,
    disabledExplanation: "header.csvWithHashDisabledMessage",
    exportFunction: exportPath => excelExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) => computeExportFilePath(originalPath, sessionName, ExportType.EXCEL),
    isActive: ({ areHashesReady }) => areHashesReady,
    label: "Excel",
  },
  [ExportType.RESIP]: {
    category: ExportCategory.EXCHANGE_WITH_ERMS,
    exportFunction: exportPath => resipExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) => {
      const { fileSuffix, extension } = exportFilesConfigs[ExportType.RESIP];
      return path.join(originalPath, getNameWithExtension(`${sessionName}-${fileSuffix}`, extension));
    },
    isActive: true,
    isFilePickerDisabled: true,
    label: "RESIP",
  },
  [ExportType.METS]: {
    category: ExportCategory.EXCHANGE_WITH_ERMS,
    disabledExplanation: "header.metsDisabledMessage",
    exportFunction: exportPath => metsExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) => computeExportFilePath(originalPath, sessionName, ExportType.METS),
    isActive: false,
    label: "METS (beta)",
  },
  [ExportType.DELETION_SCRIPT]: {
    category: ExportCategory.UTILITIES,
    exportFunction: exportPath => deletionScriptExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.DELETION_SCRIPT),
    isActive: true,
    label: "export.deletionScript",
  },
};
