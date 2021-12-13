/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Field, Message, Type } from "protobufjs";

@Type.d("FilesAndFolders")
export class FilesAndFoldersMessage extends Message<FilesAndFoldersMessage> {
  @Field.d(1, "string")
  // @ts-expect-error
  public id: string;

  @Field.d(2, "string")
  // @ts-expect-error
  public name: string;

  @Field.d(3, "string", "repeated", [])
  // @ts-expect-error
  public children: string[];

  @Field.d(4, "float")
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public file_size: number;

  @Field.d(5, "float")
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public file_last_modified: number;

  @Field.d(6, "string")
  // @ts-expect-error
  public virtualPath: string;
}

@Type.d("FilesAndFoldersMetadata")
export class FilesAndFoldersMetadataMessage extends Message<FilesAndFoldersMetadataMessage> {
  @Field.d(1, "float")
  // @ts-expect-error
  public maxLastModified: number;

  @Field.d(2, "float")
  // @ts-expect-error
  public minLastModified: number;

  @Field.d(3, "float")
  // @ts-expect-error
  public medianLastModified: number;

  @Field.d(4, "float")
  // @ts-expect-error
  public averageLastModified: number;

  @Field.d(5, "float")
  // @ts-expect-error
  public childrenTotalSize: number;

  @Field.d(6, "float")
  // @ts-expect-error
  public nbChildrenFiles: number;

  @Field.d(7, "float", "repeated")
  // @ts-expect-error
  public sortBySizeIndex: number[];

  @Field.d(8, "float", "repeated")
  // @ts-expect-error
  public sortByDateIndex: number[];

  @Field.d(9, "float", "repeated")
  // @ts-expect-error
  public sortAlphaNumericallyIndex: number[];

  @Field.d(10, "float")
  // @ts-expect-error
  public initialMinLastModified: number;

  @Field.d(11, "float")
  // @ts-expect-error
  public initialMedianLastModified: number;

  @Field.d(12, "float")
  // @ts-expect-error
  public initialMaxLastModified: number;
}
