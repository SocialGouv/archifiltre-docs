import path from "path";
import { createChartReplacer, exportToDocX } from "util/docx/docx-util";

interface AuditReportFile {
  name: string;
  path: string;
}

export interface AuditReportFileWithDate extends AuditReportFile {
  date: string;
}

export interface AuditReportFileWithSize extends AuditReportFile {
  size: string;
}

export interface AuditReportFileWithCount extends AuditReportFile {
  count: number;
}

export interface AuditReportElementWithType extends AuditReportFile {
  type: string;
  size: string;
  date: string;
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
  publicationPercent: number;
  publicationCount: number;
  publicationFileTypes: string;
  presentationPercent: number;
  presentationCount: number;
  presentationFileTypes: string;
  spreadsheetPercent: number;
  spreadsheetCount: number;
  spreadsheetFileTypes: string;
  emailPercent: number;
  emailCount: number;
  emailFileTypes: string;
  documentPercent: number;
  documentCount: number;
  documentFileTypes: string;
  imagePercent: number;
  imageCount: number;
  imageFileTypes: string;
  videoPercent: number;
  videoCount: number;
  videoFileTypes: string;
  audioPercent: number;
  audioCount: number;
  audioFileTypes: string;
  otherPercent: number;
  otherCount: number;
  otherFileTypes: string;
  oldestFiles: AuditReportFileWithDate[];
  biggestFiles: AuditReportFileWithSize[];
  duplicateFolderCount: number;
  duplicateFolderPercent: number;
  duplicateFileCount: number;
  duplicateFilePercent: number;
  duplicateTotalSize: string;
  duplicates: AuditReportFileWithCount[];
  biggestDuplicateFolders: AuditReportFileWithSize[];
  elementsToDelete: AuditReportElementWithType[];
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
): Buffer =>
  exportToDocX(
    TEMPLATE_PATH,
    auditReportData,
    createChartReplacer("chart1", CHART_TEMPLATE_PATH)
  );
