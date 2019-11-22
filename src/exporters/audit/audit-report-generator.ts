import fs from "fs";
import path from "path";
import { exportToDocX } from "../../util/docx-util";

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
  emailPercent;
  emailCount;
  mediaPercent;
  mediaCount;
  otherPercent;
  otherCount;
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

const TEMPLATE_PATH = path.join(
  STATIC_ASSETS_PATH,
  "template/auditReportTemplate.docx"
);

export const generateAuditReportDocx = (auditReportData: AuditReportData) =>
  exportToDocX(TEMPLATE_PATH, auditReportData);
