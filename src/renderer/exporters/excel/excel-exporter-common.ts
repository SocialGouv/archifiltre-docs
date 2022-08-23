export const TREE_CSV_PROGRESS_WEIGHT = 1;
export const CSV_EXPORT_PROGRESS_WEIGHT = 10;

export const getExcelExportProgressGoal = (
  filesAndFoldersCount: number
): number =>
  (TREE_CSV_PROGRESS_WEIGHT + CSV_EXPORT_PROGRESS_WEIGHT) *
  filesAndFoldersCount;

export interface CreateExcelWorkbookParams {
  csvArray: string[][];
  treeCsv: string[][];
}
