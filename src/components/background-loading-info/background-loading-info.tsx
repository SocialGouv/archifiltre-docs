import React, { FC, memo, useCallback, useState } from "react";
import styled from "styled-components";
import { LoadingInfo } from "../../reducers/loading-info/loading-info-types";
import { SUCCESS_GREEN } from "../../util/color-util";
import ChevronRight from "../common/chevron-right";
import LoadingInfoDisplay from "./loading-info-display";
import LoadingSpinnerOrCloseCross from "./loading-spinner-or-close-cross";

const BottomRightArea = memo(styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: white;
  display: flex;
  border-radius: 2px;
  border: 0.5px solid ${SUCCESS_GREEN};
`);

const ToggleAndLoaderArea = memo(styled.div`
  width: 37px;
`);

const LoadingBarArea = memo(styled.div`
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
`);

const ToggleArrow = memo(styled.button`
  stroke: green;
  width: 37px;
  height: 37px;
  cursor: pointer;
  ${({ collapsed }) => (collapsed ? "transform: rotate(0.5turn)" : "")}
`);

interface BackgroundLoadingInfoProps {
  loadingItems: LoadingInfo[];
  isLoading: boolean;
  dismissAll: () => void;
}

const BackgroundLoadingInfo: FC<BackgroundLoadingInfoProps> = ({
  loadingItems,
  isLoading,
  dismissAll
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = useCallback(() => setCollapsed(!collapsed), [
    collapsed,
    setCollapsed
  ]);
  const isActive = loadingItems.length > 0;

  if (!isActive) {
    return null;
  }
  return (
    <BottomRightArea>
      <ToggleAndLoaderArea>
        <ToggleArrow collapsed={collapsed} onClick={toggleCollapsed}>
          <ChevronRight color={SUCCESS_GREEN} />
        </ToggleArrow>
        {collapsed && (
          <LoadingSpinnerOrCloseCross
            isLoading={isLoading}
            onClose={dismissAll}
          />
        )}
      </ToggleAndLoaderArea>
      {!collapsed && (
        <LoadingBarArea>
          {loadingItems.map(loadingInfo => (
            <LoadingInfoDisplay
              key={loadingInfo.id}
              loadingInfo={loadingInfo}
              color={SUCCESS_GREEN}
            />
          ))}
        </LoadingBarArea>
      )}
    </BottomRightArea>
  );
};

export default memo(BackgroundLoadingInfo);
