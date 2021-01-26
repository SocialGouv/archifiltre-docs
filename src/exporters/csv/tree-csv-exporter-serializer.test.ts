import { createFilesAndFolders } from "files-and-folders-loader/files-and-folders-loader";
import { MockWritable } from "stdio-mock";
import Stream from "stream";
import { Language } from "hooks/use-language";
import {
  parseTreeCsvExporterOptionsFromStream,
  stringifyTreeCsvExporterOptionsToStream,
  TreeCsvExporterParams,
} from "exporters/csv/tree-csv-exporter-serializer";

const extractDataFromMock = (writeable: MockWritable): Promise<Buffer[]> =>
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

    // @ts-ignore
    stringifyTreeCsvExporterOptionsToStream(writeable, exporterOptions);

    const sentData: Buffer[] = await extractDataFromMock(writeable);

    const parsedOptions = await parseTreeCsvExporterOptionsFromStream(
      Stream.Readable.from(sentData)
    );

    expect(parsedOptions).toEqual(exporterOptions);
  });
});
