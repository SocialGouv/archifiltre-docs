import parse from "csv-parse";
import { createReadStream } from "fs";

import { ipcMain } from "../ipc";

declare module "../ipc/event" {
  interface AsyncIpcMapping {
    "metadata.importMetadata": IpcConfig<
      [filePath: string],
      Record<string, string>[]
    >;
  }
}

export const loadMetadata = (): void => {
  ipcMain.handle("metadata.importMetadata", async (_event, filePath) => {
    const input = createReadStream(filePath);
    const parser = parse({
      columns: true,
    });
    const metadata: Record<string, string>[] = [];

    await new Promise<Record<string, string>[]>((resolve, reject) => {
      input
        .pipe(parser)
        .on("data", (data: Record<string, string>) => metadata.push(data))
        .on("end", () => {
          resolve(metadata);
        })
        .on("error", reject);
    });

    return metadata;
  });
};
