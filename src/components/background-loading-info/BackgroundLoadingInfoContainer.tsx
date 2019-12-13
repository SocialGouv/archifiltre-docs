import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dismissAllComplete } from "../../reducers/loading-info/loading-info-actions";
import {
  getCompleteLoadingInfo,
  getLoadingInfoFromStore,
  getRunningLoadingInfo
} from "../../reducers/loading-info/loading-info-selectors";
import BackgroundLoadingInfo from "./BackgroundLoadingInfo";

const BackgroundLoadingInfoContainer = () => {
  const loadingInfoState = useSelector(getLoadingInfoFromStore);
  const dispatch = useDispatch();

  const loadingItems = useMemo(() => getRunningLoadingInfo(loadingInfoState), [
    loadingInfoState.loading,
    loadingInfoState.loadingInfo
  ]);

  const completedItems = useMemo(
    () => getCompleteLoadingInfo(loadingInfoState),
    [loadingInfoState.complete, loadingInfoState.loadingInfo]
  );

  const displayedItems = useMemo(() => [...loadingItems, ...completedItems], [
    loadingItems,
    completedItems
  ]);

  const dismissAll = useCallback(() => dispatch(dismissAllComplete()), [
    dispatch
  ]);

  const isLoading = loadingInfoState.loading.length > 0;

  return (
    <BackgroundLoadingInfo
      loadingItems={displayedItems}
      isLoading={isLoading}
      dismissAll={dismissAll}
    />
  );
};

export default BackgroundLoadingInfoContainer;
