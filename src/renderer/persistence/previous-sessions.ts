import { getPath } from "@common/utils/electron";
import fs from "fs";
import path from "path";

import { reportError } from "../logging/reporter";

const MAX_SHORTCUTS_LENGTH = 10;

function getPreviousSessionsPath(): string {
  const userFolderPath = getPath("userData");
  return path.join(userFolderPath, "previous-sessions");
}

/**
 * Remove duplicates and incorrect data from previous sessions array
 */
const sanitizePreviousSessions = (previousSessions: string[]) => {
  const sanitizedPreviousSessions = previousSessions.map(session => session.replace(/\r/g, ""));

  return sanitizedPreviousSessions
    .map(session => session.replace(/\r/g, ""))
    .filter((session, index) => sanitizedPreviousSessions.indexOf(session) === index)
    .filter(session => !session.includes("\0"));
};

/**
 * If no file exists, create an empty file with the previous sessions path
 */
export function initPreviousSessions(): void {
  try {
    const previousSessionsPath = getPreviousSessionsPath();
    if (!fs.existsSync(previousSessionsPath)) {
      fs.writeFileSync(previousSessionsPath, "");
    }
  } catch (error: unknown) {
    reportError(error);
  }
}

/**
 * Read previous sessions paths, an empty array if there are none.
 */
export function getPreviousSessions(): string[] {
  try {
    const previousSessionsPath = getPreviousSessionsPath();
    const previousSessions = fs.readFileSync(previousSessionsPath, "utf8");
    if (previousSessions === "") {
      return [];
    }
    const previousSessionsList = previousSessions.trim().split("\n");
    return sanitizePreviousSessions(previousSessionsList);
  } catch (error: unknown) {
    reportError(error);
    return [];
  }
}

const removeDuplicateLines = (lines: string): string[] => [...new Set(lines.trim().split("\n"))];

/**
 * Save a new user session in previous-sessions
 * @param newSessionPath - new value for user settings
 */
export async function savePreviousSession(newSessionPath: string): Promise<void> {
  try {
    const previousSessionsPath = getPreviousSessionsPath();
    const previousSessions = fs.readFileSync(previousSessionsPath, "utf8");
    const previousSessionsList = [...removeDuplicateLines(previousSessions), `\r\n${newSessionPath}`]
      .reverse()
      .slice(0, MAX_SHORTCUTS_LENGTH)
      .join("\n")
      .concat("\n");

    await fs.promises.writeFile(previousSessionsPath, previousSessionsList);
  } catch (error: unknown) {
    reportError(error);
  }
}

const removeClickedElement = (previousSession: string, elementToDelete: string) =>
  previousSession.replace(`${elementToDelete}\n`, "");

export async function removeOneSessionElement(elementToDelete: string): Promise<void> {
  try {
    const previousSessionsPath = getPreviousSessionsPath();
    const previousSessions = fs.readFileSync(previousSessionsPath, "utf8");
    const previousSessionsSanitized = removeClickedElement(previousSessions, elementToDelete);

    await fs.promises.writeFile(previousSessionsPath, previousSessionsSanitized);
  } catch (error: unknown) {
    reportError(error);
  }
}

export function clearSession(): void {
  try {
    const previousSessionPath = getPreviousSessionsPath();
    fs.writeFileSync(previousSessionPath, "");
  } catch (error: unknown) {
    reportError(error);
  }
}
