import { ArchifiltreThunkAction } from "reducers/archifiltre-types";
import { generateExcelExport$ } from "exporters/excel/excel-exporter-controller";
import { getCsvExportParamsFromStore } from "util/array-export/array-export-utils";
import { filterResults } from "util/batch-process/batch-process-util";
import { promises as fs } from "fs";

export const excelExporterThunk = (
  name: string
): ArchifiltreThunkAction => async (dispatch, getState) => {
  const exportData = getCsvExportParamsFromStore(getState());

  const { result } = await generateExcelExport$(exportData)
    .pipe(filterResults())
    .toPromise();

  await fs.writeFile(name, result, "binary");
};
