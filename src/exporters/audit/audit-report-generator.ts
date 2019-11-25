import path from "path";
import { createChartReplacer, exportToDocX } from "../../util/docx-util";

interface AuditReportFile {
  name: string;
  path: string;
}

interface AuditReportFileWithDate extends AuditReportFile {
  date: string;
}

interface AuditReportFileWithSize extends AuditReportFile {
  size: string;
}

interface AuditReportFileWithCount extends AuditReportFile {
  count: number;
}

export interface AuditReportData {
  totalFoldersCount: number;
  totalFilesCount: number;
  totalSize: string;
  oldestDate: string;
  newestDate: string;
  longestPathLength: number;
  longestPathFileName: string;
  longestPathPath: string;
  depth: number;
  presentationPercent: number;
  presentationCount: number;
  documentPercent: number;
  documentCount: number;
  spreadsheetPercent: number;
  spreadsheetCount: number;
  emailPercent: number;
  emailCount: number;
  mediaPercent: number;
  mediaCount: number;
  otherPercent: number;
  otherCount: number;
  oldestFiles: AuditReportFileWithDate[];
  biggestFiles: AuditReportFileWithSize[];
  duplicateFolderCount: number;
  duplicateFolderPercent: number;
  duplicateFileCount: number;
  duplicateFilePercent: number;
  duplicateTotalSize: string;
  duplicates: AuditReportFileWithCount[];
  biggestDuplicateFiles: AuditReportFileWithSize[];
}

const TEMPLATE_PATH = path.resolve(
  STATIC_ASSETS_PATH,
  "template/auditReportTemplate.docx"
);

/*
 * To update the chart template, you will need to create a docx, unzip it, and get the xml chart file.
 * The xml chart files are in the folder word/charts.
 * Then, you replace the numeric values by templated strings like "<c:v>{presentationCount}</c:v>"
 */
const CHART_TEMPLATE_PATH = path.resolve(
  STATIC_ASSETS_PATH,
  "template/chartTemplate.xml"
);

/**
 * Generates the docx Blob
 * @param auditReportData
 */
export const generateAuditReportDocx = (
  auditReportData: AuditReportData
): Blob =>
  exportToDocX(
    TEMPLATE_PATH,
    auditReportData,
    createChartReplacer("chart1", CHART_TEMPLATE_PATH)
  );
