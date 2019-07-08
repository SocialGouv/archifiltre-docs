const Path = require("path");
const hashFile = require("./file-sys-util").hashFile;

export async function fileAndFoldersToCsv(fileAndFolders, allTags, basePath) {
  const ans = [
    [
      "path",
      "name",
      "size (octet)",
      "last_modified",
      "alias",
      "comments",
      "tags",
      "hash",
      "is_file"
    ]
  ];

  const serializedFF = fileAndFolders.toJS();

  const filesPromises = Object.keys(serializedFF)
    .map(key => ({ id: key, ...serializedFF[key] }))
    .map(async ff => {
      if (ff.id === "") {
        return undefined;
      }
      const path = ff.id;
      const name = ff.name;
      const size = ff.size;
      const last_modified = ff.last_modified_max;
      const alias = ff.alias;
      const comments = ff.comments;
      const tags = allTags
        .filter(tag => tag.get("ff_ids").includes(ff.id))
        .reduce((acc, val) => acc.concat([val.get("name")]), []);
      const children = ff.children;
      const is_file = children.length === 0;

      let hash = "";
      if (is_file) {
        hash = await hashFile(Path.join(basePath, "..", path));
      }

      return [
        path,
        name,
        size,
        last_modified,
        alias,
        comments,
        tags,
        hash,
        is_file
      ];
    });

  const files = await Promise.all(filesPromises);

  const cleanedFiles = files.filter(array => array !== undefined);
  return ans.concat(cleanedFiles);
}
