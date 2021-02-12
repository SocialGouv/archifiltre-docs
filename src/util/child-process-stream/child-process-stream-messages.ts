import { Field, Message, Type } from "protobufjs";

@Type.d("FilesAndFolders")
export class FilesAndFoldersMessage extends Message<FilesAndFoldersMessage> {
  @Field.d(1, "string")
  public id: string;

  @Field.d(2, "string")
  public name: string;

  @Field.d(3, "string", "repeated", [])
  public children: string[];

  @Field.d(4, "float")
  public file_size: number;

  @Field.d(5, "float")
  public file_last_modified: number;

  @Field.d(6, "string")
  public virtualPath: string;
}

@Type.d("FilesAndFoldersMetadata")
export class FilesAndFoldersMetadataMessage extends Message<FilesAndFoldersMetadataMessage> {
  @Field.d(1, "float")
  public maxLastModified: number;

  @Field.d(2, "float")
  public minLastModified: number;

  @Field.d(3, "float")
  public medianLastModified: number;

  @Field.d(4, "float")
  public averageLastModified: number;

  @Field.d(5, "float")
  public childrenTotalSize: number;

  @Field.d(6, "float")
  public nbChildrenFiles: number;

  @Field.d(7, "float", "repeated")
  public sortBySizeIndex: number[];

  @Field.d(8, "float", "repeated")
  public sortByDateIndex: number[];

  @Field.d(9, "float", "repeated")
  public sortAlphaNumericallyIndex: number[];

  @Field.d(10, "float")
  public initialMinLastModified: number;

  @Field.d(11, "float")
  public initialMedianLastModified: number;

  @Field.d(12, "float")
  public initialMaxLastModified: number;
}
