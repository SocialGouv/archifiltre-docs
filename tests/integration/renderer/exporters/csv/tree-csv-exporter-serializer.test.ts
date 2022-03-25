import type { TreeCsvExporterParams } from "@renderer/exporters/csv/tree-csv-exporter-serializer";
import { parseTreeCsvExporterOptionsFromStream } from "@renderer/exporters/csv/tree-csv-exporter-serializer";
import { createFilesAndFolders } from "@renderer/files-and-folders-loader/files-and-folders-loader";
import { Language } from "@renderer/utils/language/types";
import { MockWritable } from "stdio-mock";
import Stream from "stream";

const extractDataFromMock = async (
  writeable: MockWritable
): Promise<Buffer[]> =>
  new Promise((resolve) => {
    writeable.on("finish", () => {
      resolve(writeable.data());
    });
  });

describe("tree-csv-exporter-serializer", () => {
  it("should send and parse a TreeCsvExporterOptions", async () => {
    const exporterOptions: TreeCsvExporterParams = {
      filesAndFolders: {
        ff: createFilesAndFolders({ id: "ff" }),
      },
      language: Language.FR,
    };

    const writeable = new MockWritable();

    // @ts-expect-error Mock
    stringifyTreeCsvExporterOptionsToStream(writeable, exporterOptions);

    const sentData: Buffer[] = await extractDataFromMock(writeable);

    const parsedOptions = await parseTreeCsvExporterOptionsFromStream(
      Stream.Readable.from(sentData)
    );

    expect(parsedOptions).toEqual(exporterOptions);
  });
});
