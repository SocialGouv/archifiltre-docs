import { STATIC_PATH } from "@common/config";
import { type SimpleObject } from "@common/utils/object";
import path from "path";

import { createChartReplacer, exportToDocX } from "../../utils/docx/docx-util";

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
  date: string;
  size: string;
  type: string;
}

export interface AuditReportData {
  archifiltreVersion: string;
  audioCount: number;
  audioFileTypes: string;
  audioPercent: number;
  biggestDuplicateFolders: AuditReportFileWithSize[];
  biggestFiles: AuditReportFileWithSize[];
  depth: number;
  documentCount: number;
  documentFileTypes: string;
  documentPercent: number;
  duplicateFileCount: number;
  duplicateFilePercent: number;
  duplicateFolderCount: number;
  duplicateFolderPercent: number;
  duplicateTotalCO2: string;
  duplicateTotalSize: string;
  duplicates: AuditReportFileWithCount[];
  elementsToDelete: AuditReportElementWithType[];
  emailCount: number;
  emailFileTypes: string;
  emailPercent: number;
  imageCount: number;
  imageFileTypes: string;
  imagePercent: number;
  longestPathFileName: string;
  longestPathLength: number;
  longestPathPath: string;
  newestDate: string;
  oldestDate: string;
  oldestFiles: AuditReportFileWithDate[];
  otherCount: number;
  otherFileTypes: string;
  otherPercent: number;
  presentationCount: number;
  presentationFileTypes: string;
  presentationPercent: number;
  publicationCount: number;
  publicationFileTypes: string;
  publicationPercent: number;
  spreadsheetCount: number;
  spreadsheetFileTypes: string;
  spreadsheetPercent: number;
  totalCO2: string;
  totalFilesCount: number;
  totalFoldersCount: number;
  totalSize: string;
  videoCount: number;
  videoFileTypes: string;
  videoPercent: number;
}

const TEMPLATE_PATH = path.resolve(STATIC_PATH, "template/auditReportTemplate.docx");

/*
 * To update the chart template, you will need to create a docx, unzip it, and get the xml chart file.
 * The xml chart files are in the folder word/charts.
 * Then, you replace the numeric values by templated strings like "<c:v>{presentationCount}</c:v>"
 */
const CHART_TEMPLATE_PATH = path.resolve(STATIC_PATH, "template/chartTemplate.xml");

/**
 * Generates the docx Blob
 */
export const generateAuditReportDocx = (auditReportData: AuditReportData): Buffer =>
  exportToDocX(
    TEMPLATE_PATH,
    auditReportData as unknown as SimpleObject,
    createChartReplacer("chart1", CHART_TEMPLATE_PATH),
  );
