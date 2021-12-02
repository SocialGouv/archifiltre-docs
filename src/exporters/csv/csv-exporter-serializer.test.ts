import type { GenerateCsvExportOptions } from "exporters/csv/csv-exporter.controller";
import {
    parseCsvExporterOptionsFromStream,
    stringifyCsvExporterOptionsToStream,
} from "exporters/csv/csv-exporter-serializer";
import { createFilesAndFolders } from "files-and-folders-loader/files-and-folders-loader";
import { createFilesAndFoldersMetadata } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import { createTag } from "reducers/tags/tags-test-util";
import { MockWritable } from "stdio-mock";
import Stream from "stream";
import type { WithLanguage } from "util/language/language-types";
import { Language } from "util/language/language-types";

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

        // @ts-expect-error
        stringifyCsvExporterOptionsToStream(writeable, exporterOptions);

        const sentData: Buffer[] = await extractDataFromMock(writeable);

        const parsedOptions = await parseCsvExporterOptionsFromStream(
            Stream.Readable.from(sentData)
        );

        expect(parsedOptions).toEqual(exporterOptions);
    });
});
