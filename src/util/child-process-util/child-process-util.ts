import childProcess from "child_process";

export const runCommand = async (
  command: string,
  args: string[]
): Promise<string> =>
  new Promise((resolve, reject) => {
    const process = childProcess.spawn(command, args);

    let result = "";
    let error = "";
    process.stdout.on("data", (resultData: string) => {
      result += resultData;
    });

    process.stderr.on("data", (errorData: string) => {
      error += errorData;
    });
    process.on("close", (code) => {
      if (code) {
        reject({
          code,
          message: error,
        });
        return;
      }
      resolve(result);
    });

    return "";
  });
