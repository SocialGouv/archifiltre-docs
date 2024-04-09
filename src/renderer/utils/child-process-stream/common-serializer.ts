import { type Message } from "protobufjs";

import { type WithHashes } from "../../files-and-folders-loader/files-and-folders-loader-types";
import { type FilesAndFolders } from "../../reducers/files-and-folders/files-and-folders-types";
import { type FilesAndFoldersMetadata } from "../../reducers/files-and-folders-metadata/files-and-folders-metadata-types";
import { type WithFilesAndFolders, type WithFilesAndFoldersMetadata } from "../virtual-file-system";

export const extractKeysFromFilesAndFolders = ({ filesAndFolders }: WithFilesAndFolders): string[] =>
  Object.keys(filesAndFolders);

type Extractor<TInput, TOutput> = (input: TInput, key: string) => TOutput;

export function makeDataExtractor<TInput, TOutput>(extractor: Extractor<TInput, TOutput>): Extractor<TInput, TOutput>;
export function makeDataExtractor<TIn, TOut1, TOut2>(
  extractor: Extractor<TIn, TOut1>,
  extractor2: Extractor<TIn, TOut2>,
): Extractor<TIn, TOut1 & TOut2>;
export function makeDataExtractor<TIn, TOut1, TOut2, TOut3>(
  extractor: Extractor<TIn, TOut1>,
  extractor2: Extractor<TIn, TOut2>,
  extractor3: Extractor<TIn, TOut3>,
): Extractor<TIn, TOut1 & TOut2 & TOut3>;
export function makeDataExtractor<TIn, TOut1, TOut2, TOut3, TOut4>(
  extractor: Extractor<TIn, TOut1>,
  extractor2: Extractor<TIn, TOut2>,
  extractor3: Extractor<TIn, TOut3>,
  extractor4: Extractor<TIn, TOut4>,
): Extractor<TIn, TOut1 & TOut2 & TOut3 & TOut4>;
export function makeDataExtractor<TIn>(...extractors: Array<Extractor<TIn, unknown>>): Extractor<TIn, unknown> {
  return (data, key) =>
    Object.assign({}, ...extractors.map(extractor => extractor(data, key))) as Extractor<TIn, unknown>;
}

export const extractKey = <T>(_input: T, key: string): { key: string } => ({
  key,
});

export const extractFilesAndFolders = <T extends WithFilesAndFolders>(
  input: T,
  key: string,
): { filesAndFolders: FilesAndFolders } => ({
  filesAndFolders: input.filesAndFolders[key],
});

export const extractFilesAndFoldersMetadata = <T extends WithFilesAndFoldersMetadata>(
  input: T,
  key: string,
): {
  filesAndFoldersMetadata: FilesAndFoldersMetadata;
} => ({
  filesAndFoldersMetadata: input.filesAndFoldersMetadata[key],
});

export const extractHashes = <T extends Partial<WithHashes>>(
  input: T,
  key: string,
): {
  hash: string | null;
} => ({
  hash: input.hashes ? input.hashes[key] : null,
});

export type OmitProtobuf<T extends Message> = Omit<Omit<T, "toJSON">, "$type">;
