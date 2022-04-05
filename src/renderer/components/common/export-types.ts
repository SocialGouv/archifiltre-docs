interface ExportToCsvOptions {
  withHashes: boolean;
}

interface ExportToMetsOptions {
  originalPath: string;
  sessionName: string;
}

export type ExportToAuditReport = (name: string) => void;
export type ExportToCsv = (name: string, options?: ExportToCsvOptions) => void;
export type ExportToResip = (name: string) => void;
export type ExportToMets = (options: ExportToMetsOptions) => void;
