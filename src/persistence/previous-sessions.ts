import { remote } from "electron";
import fs from "fs";
import { reportError } from "logging/reporter";
import path from "path";

const getPreviousSessionsPath = (): string => {
  const userFolderPath = remote.app.getPath("userData");
  return path.join(userFolderPath, "previous-sessions");
};

/**
 * Remove duplicates and incorrect data from previous sessions array
 * @param previousSessions
 */
const sanitizePreviousSessions = (previousSessions: string[]) => {
  const sanitizedPreviousSessions = previousSessions.map((session) =>
    session.replace(/\r/g, "")
  );

  return sanitizedPreviousSessions
    .map((session) => session.replace(/\r/g, ""))
    .filter(
      (session, index) => sanitizedPreviousSessions.indexOf(session) === index
    )
    .filter((session) => !session.includes("\0"))
    .reverse();
};

/**
 * If no file exists, create an empty file with the previous sessions path
 */
export const initPreviousSessions = (): void => {
  try {
    const previousSessionsPath = getPreviousSessionsPath();
    if (!fs.existsSync(previousSessionsPath)) {
      fs.writeFileSync(previousSessionsPath, "");
    }
  } catch (error) {
    reportError(error);
  }
};

/**
 * Read previous sessions paths, an empty array if there are none.
 */
export const getPreviousSessions = (): string[] => {
  try {
    const previousSessionsPath = getPreviousSessionsPath();
    const previousSessions = fs.readFileSync(previousSessionsPath, "utf8");
    if (previousSessions === "") {
      return [];
    }
    const previousSessionsList = previousSessions.trim().split("\n");
    return sanitizePreviousSessions(previousSessionsList);
  } catch (error) {
    reportError(error);
    return [];
  }
};

/**
 * Save a new user session in previous-sessions
 * @param newSessionPath - new value for user settings
 */
export const savePreviousSession = async (newSessionPath: string) => {
  try {
    await fs.promises.appendFile(
      getPreviousSessionsPath(),
      `\r\n${newSessionPath}`
    );
  } catch (error) {
    reportError(error);
  }
};
