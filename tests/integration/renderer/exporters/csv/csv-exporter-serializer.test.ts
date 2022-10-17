import type { GenerateCsvExportOptions } from "@renderer/exporters/csv/csv-exporter.controller";
import {
  parseCsvExporterOptionsFromStream,
  stringifyCsvExporterOptionsToStream,
} from "@renderer/exporters/csv/csv-exporter-serializer";
import { createFilesAndFolders } from "@renderer/files-and-folders-loader/files-and-folders-loader";
import { createFilesAndFoldersMetadata } from "@renderer/reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { createTag } from "@renderer/reducers/tags/tags-selectors";
import type { WithLanguage } from "@renderer/utils/language/types";
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

describe("csv-exporter-serializer", () => {
  it("should send and parse a CsvExporterOptions", async () => {
    const exporterOptions: WithLanguage<GenerateCsvExportOptions> = {
      aliases: {},
      comments: {},
      elementsToDelete: [],
      filesAndFolders: {
        ff: createFilesAndFolders({ id: "ff" }),
      },
      filesAndFoldersMetadata: {
        ff: createFilesAndFoldersMetadata({}),
      },
      hashes: {
        ff: "ff-hash",
      },
      language: Language.FR,
      tags: {
        tag: createTag({ id: "tag" }),
      },
    };

    const writeable = new MockWritable();

    stringifyCsvExporterOptionsToStream(writeable as any, exporterOptions);

    const sentData: Buffer[] = await extractDataFromMock(writeable);

    const parsedOptions = await parseCsvExporterOptionsFromStream(
      Stream.Readable.from(sentData)
    );

    expect(parsedOptions).toEqual(exporterOptions);
  });
});
