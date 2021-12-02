import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { dismissAllComplete } from "../../reducers/loading-info/loading-info-actions";
import {
    getCompleteLoadingInfo,
    getLoadingInfoFromStore,
    getRunningLoadingInfo,
} from "../../reducers/loading-info/loading-info-selectors";
import { BackgroundLoadingInfo } from "./background-loading-info";

export const BackgroundLoadingInfoContainer: React.FC = () => {
    const loadingInfoState = useSelector(getLoadingInfoFromStore);
    const dispatch = useDispatch();

    const loadingItems = useMemo(
        () => getRunningLoadingInfo(loadingInfoState),
        [loadingInfoState]
    );

    const completedItems = useMemo(
        () => getCompleteLoadingInfo(loadingInfoState),
        [loadingInfoState]
    );

    const displayedItems = useMemo(
        () => [...loadingItems, ...completedItems],
        [loadingItems, completedItems]
    );

    const dismissAll = useCallback(
        () => dispatch(dismissAllComplete()),
        [dispatch]
    );

    const isLoading = loadingInfoState.loading.length > 0;

    return (
        <BackgroundLoadingInfo
            loadingItems={displayedItems}
            isLoading={isLoading}
            dismissAll={dismissAll}
        />
    );
};
