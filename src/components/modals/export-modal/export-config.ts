import { ExportTypesMap } from "components/modals/export-modal/export-options";
import { csvExporterThunk } from "exporters/csv/csv-exporter";
import _ from "lodash";
import path from "path";
import { auditReportExporterThunk } from "exporters/audit/audit-report-exporter";
import { metsExporterThunk } from "exporters/mets/mets-export-thunk";
import { resipExporterThunk } from "exporters/resip/resip-exporter-thunk";
import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { getNameWithExtension } from "util/file-system/file-sys-util";

export enum ExportType {
  AUDIT = "AUDIT",
  CSV = "CSV",
  CSV_WITH_HASHES = "CSV_WITH_HASHES",
  RESIP = "RESIP",
  METS = "METS",
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
  [ExportType.RESIP]: { fileSuffix: "resip", extension: "csv" },
  [ExportType.METS]: { fileSuffix: "mets", extension: "zip" },
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
  },
  [ExportType.CSV]: {
    isActive: true,
    label: "CSV",
    exportFunction: (exportPath) => csvExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.CSV),
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
  },
  [ExportType.METS]: {
    isActive: true,
    label: "METS (beta)",
    exportFunction: (exportPath) => metsExporterThunk(exportPath),
    exportPath: (originalPath, sessionName) =>
      computeExportFilePath(originalPath, sessionName, ExportType.METS),
  },
};
