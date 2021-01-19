import { Field, Message, Type } from "protobufjs";

@Type.d("FilesAndFolders")
export class VFSElementMessage extends Message<VFSElementMessage> {
  @Field.d(1, "string")
  public key: string;

  @Field.d(2, "string")
  public id: string;

  @Field.d(3, "string")
  public name: string;

  @Field.d(4, "string", "repeated", [])
  public children: string[];

  @Field.d(5, "float")
  public file_size: number;

  @Field.d(6, "float")
  public file_last_modified: number;

  @Field.d(7, "string")
  public virtualPath: string;

  @Field.d(8, "float")
  public maxLastModified: number;

  @Field.d(9, "float")
  public minLastModified: number;

  @Field.d(10, "float")
  public medianLastModified: number;

  @Field.d(11, "float")
  public averageLastModified: number;

  @Field.d(12, "float")
  public childrenTotalSize: number;

  @Field.d(13, "float")
  public nbChildrenFiles: number;

  @Field.d(14, "float", "repeated")
  public sortBySizeIndex: number[];

  @Field.d(15, "float", "repeated")
  public sortByDateIndex: number[];

  @Field.d(16, "float", "repeated")
  public sortAlphaNumericallyIndex: number[];

  @Field.d(17, "string")
  public hash: string | null;
}
