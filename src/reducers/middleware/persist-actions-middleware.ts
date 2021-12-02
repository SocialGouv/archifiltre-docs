import { promises as fs } from "fs";
import path from "path";
import { useEffect, useState } from "react";
import type { Action, Middleware } from "redux";

import { reportError, reportInfo } from "../../logging/reporter";
import translations from "../../translations/translations";
import { getPath } from "../../util/electron/electron-util";
import type { VoidFunction } from "../../util/function/function-util";
import { notifyError } from "../../util/notification/notifications-util";
import type { SimpleObject } from "../../util/object/object-util";
import { setLoadingStep } from "../loading-state/loading-state-actions";
import {
    loadingStateActionTypes,
    LoadingStep,
} from "../loading-state/loading-state-types";

const IGNORED_ACTIONS = [...loadingStateActionTypes];

const userFolderPath = getPath("userData");
export const previousSessionFilePath = path.join(
    userFolderPath,
    "last-session-actions"
);

const actionStack: Action<string>[] = [];
let saving = false;

/**
 * Saves all the actions present in actionStack
 */
const saveActionsFromStack = async () => {
    if (saving || actionStack.length === 0) {
        return;
    }
    const actionsToSave = actionStack.splice(0, actionStack.length);
    saving = true;
    const actionsToSaveText = actionsToSave
        .map((action) => JSON.stringify(action))
        .join("\n")
        .concat("\n");
    try {
        await fs.appendFile(previousSessionFilePath, actionsToSaveText);
        saving = false;
        void saveActionsFromStack();
    } catch (err: unknown) {
        reportError(err);
    }
};

/**
 * Replays to store all the actions present in the previous session file.
 * @param api
 */
export const replayActionsThunk =
    () =>
    async (dispatch: VoidFunction): Promise<void> => {
        try {
            const previousActions = await fs.readFile(
                previousSessionFilePath,
                "utf8"
            );
            const previousActionsArray = previousActions
                .trim()
                .split("\n")
                .map(
                    (actionString) => JSON.parse(actionString) as SimpleObject
                );
            await clearActionReplayFile();
            previousActionsArray.forEach((action) => {
                dispatch(action);
            });
            dispatch(setLoadingStep(LoadingStep.FINISHED));
        } catch (err: unknown) {
            reportError((err as Error).message);
            notifyError(
                translations.t("replay.error"),
                translations.t("replay.title")
            );
        }
    };

/**
 * Clears the previous session history file
 */
export const clearActionReplayFile = async (): Promise<void> => {
    try {
        await fs.unlink(previousSessionFilePath);
    } catch {
        reportInfo("Cannot unlink action replay file");
    }
};

const saveAction = (action: Action<string>) => {
    if (IGNORED_ACTIONS.includes(action.type)) {
        return;
    }
    actionStack.push(action);
    void saveActionsFromStack();
};

/**
 * Returns a value to verify if there is a previous session stored
 */
export const usePreviousSession = (): boolean => {
    const [hasPreviousSession, setPreviousSession] = useState(false);

    useEffect(() => {
        fs.access(previousSessionFilePath)
            .then(() => {
                setPreviousSession(true);
            })
            .catch(() => {
                reportInfo("No previous session file found");
            });
    }, [setPreviousSession]);

    return hasPreviousSession;
};

/**
 * Middleware to persist into a file all the dispatched actions
 */
export const persistActions: Middleware =
    () => (next) => (action: Action<string>) => {
        saveAction(action);
        return next(action);
    };
