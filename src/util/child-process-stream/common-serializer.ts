import {
  WithFilesAndFolders,
  WithFilesAndFoldersMetadata,
} from "util/virtual-file-system-util/virtual-file-system-util";
import { WithHashes } from "files-and-folders-loader/files-and-folders-loader-types";
import { Message } from "protobufjs";

export const extractKeysFromFilesAndFolders = ({
  filesAndFolders,
}: WithFilesAndFolders): string[] => Object.keys(filesAndFolders);

type Extractor<Input, Output> = (input: Input, key: string) => Output;

export function makeDataExtractor<Input, Output>(
  extractor: Extractor<Input, Output>
): Extractor<Input, Output>;
export function makeDataExtractor<In, Out1, Out2>(
  extractor: Extractor<In, Out1>,
  extractor2: Extractor<In, Out2>
): Extractor<In, Out1 & Out2>;
export function makeDataExtractor<In, Out1, Out2, Out3>(
  extractor: Extractor<In, Out1>,
  extractor2: Extractor<In, Out2>,
  extractor3: Extractor<In, Out3>
): Extractor<In, Out1 & Out2 & Out3>;
export function makeDataExtractor<In, Out1, Out2, Out3, Out4>(
  extractor: Extractor<In, Out1>,
  extractor2: Extractor<In, Out2>,
  extractor3: Extractor<In, Out3>,
  extractor4: Extractor<In, Out4>
): Extractor<In, Out1 & Out2 & Out3 & Out4>;
export function makeDataExtractor(...extractors) {
  return (data, key) =>
    Object.assign({}, ...extractors.map((extractor) => extractor(data, key)));
}

export const extractKey = <T extends any>(input: T, key: string) => ({
  key,
});

export const extractFilesAndFolders = <T extends WithFilesAndFolders>(
  input: T,
  key: string
) => ({
  filesAndFolders: input.filesAndFolders[key],
});

export const extractFilesAndFoldersMetadata = <
  T extends WithFilesAndFoldersMetadata
>(
  input: T,
  key: string
) => ({
  filesAndFoldersMetadata: input.filesAndFoldersMetadata[key],
});

export const extractHashes = <T extends Partial<WithHashes>>(
  input: T,
  key: string
) => ({
  hash: input.hashes ? input.hashes[key] : null,
});

export type OmitProtobuf<T extends Message> = Omit<Omit<T, "toJSON">, "$type">;
