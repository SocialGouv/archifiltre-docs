import md5File from "md5-file";

export const computeHash = filePath => md5File.sync(filePath);
