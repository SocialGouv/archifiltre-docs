import { noop } from "lodash";
import React, { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { ArchifiltreDispatch } from "../../reducers/archifiltre-types";
import {
    resetLoadingState,
    setLoadingStep,
} from "../../reducers/loading-state/loading-state-actions";
import { getLoadingStateFromStore } from "../../reducers/loading-state/loading-state-selectors";
import { LoadingStep } from "../../reducers/loading-state/loading-state-types";
import {
    replayActionsThunk,
    usePreviousSession,
} from "../../reducers/middleware/persist-actions-middleware";
import { loadFilesAndFoldersFromPathThunk } from "../../reducers/store-thunks";
import { StartScreen } from "./start-screen";

export const StartScreenContainer: React.FC = () => {
    const dispatch = useDispatch<ArchifiltreDispatch>();
    const [isLoading, setIsLoading] = useState(false);

    const terminateRef = useRef(noop);

    const loadFromPath = useCallback(
        async (path: string) => {
            setIsLoading(true);
            const { terminate } = await dispatch(
                loadFilesAndFoldersFromPathThunk(path)
            );
            terminateRef.current = terminate;
        },
        [dispatch]
    );

    const hasPreviousSession = usePreviousSession();

    const reloadPreviousSession = useCallback(() => {
        void dispatch(replayActionsThunk());
    }, [dispatch]);

    const { fileSystemLoadingStep, indexedFilesCount } = useSelector(
        getLoadingStateFromStore
    );

    const cancelLoading = useCallback(() => {
        terminateRef.current();
        dispatch(setLoadingStep(LoadingStep.WAITING));
        setIsLoading(false);
        dispatch(resetLoadingState());
    }, [terminateRef, dispatch, setIsLoading]);

    return (
        <StartScreen
            loadFromPath={loadFromPath}
            hasPreviousSession={hasPreviousSession}
            reloadPreviousSession={reloadPreviousSession}
            isLoading={isLoading}
            fileSystemLoadingStep={fileSystemLoadingStep}
            indexedFilesCount={indexedFilesCount}
            cancelLoading={cancelLoading}
        />
    );
};
