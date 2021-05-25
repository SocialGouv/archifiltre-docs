import { app } from "@electron/remote";
import fs from "fs";
import { reportError } from "logging/reporter";
import path from "path";

const MAX_SHORTCUTS_LENGTH = 10;

const getPreviousSessionsPath = (): string => {
  const userFolderPath = app.getPath("userData");
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
    .filter((session) => !session.includes("\0"));
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

const removeDuplicateLines = (lines: string): string[] => [
  ...new Set(lines.trim().split("\n")),
];

/**
 * Save a new user session in previous-sessions
 * @param newSessionPath - new value for user settings
 */
export const savePreviousSession = async (newSessionPath: string) => {
  try {
    const previousSessionsPath = getPreviousSessionsPath();
    const previousSessions = fs.readFileSync(previousSessionsPath, "utf8");
    const previousSessionsList = [
      ...removeDuplicateLines(previousSessions),
      `\r\n${newSessionPath}`,
    ]
      .reverse()
      .slice(0, MAX_SHORTCUTS_LENGTH)
      .join("\n")
      .concat("\n");

    await fs.promises.writeFile(previousSessionsPath, previousSessionsList);
  } catch (error) {
    reportError(error);
  }
};

const removeClickedElement = (
  previousSession: string,
  elementToDelete: string
) => previousSession.replace(`${elementToDelete}\n`, "");

export const removeOneSessionElement = async (elementToDelete) => {
  try {
    const previousSessionsPath = getPreviousSessionsPath();
    const previousSessions = fs.readFileSync(previousSessionsPath, "utf8");
    const previousSessionsSanitized = removeClickedElement(
      previousSessions,
      elementToDelete
    );

    await fs.promises.writeFile(
      previousSessionsPath,
      previousSessionsSanitized
    );
  } catch (error) {
    reportError(error);
  }
};

export const clearSession = async () => {
  try {
    const previousSessionPath = getPreviousSessionsPath();
    await fs.writeFileSync(previousSessionPath, "");
  } catch (error) {
    reportError(error);
  }
};
