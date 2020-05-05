import React, { FC, memo, useCallback, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import styled from "styled-components";
import { LoadingInfo } from "../../reducers/loading-info/loading-info-types";
import { SUCCESS_GREEN } from "util/color/color-util";
import LoadingInfoDisplay from "./loading-info-display";
import LoadingSpinnerOrCloseCross from "./loading-spinner-or-close-cross";
import SquaredButton from "./squared-button";
import { Grid } from "@material-ui/core";

const BottomRightArea = memo(styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: white;
  display: flex;
  border-radius: 2px;
  border: 1px solid ${SUCCESS_GREEN};
`);

const LoadingBarArea = memo(styled.div`
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
`);

interface ToggleArrowProps {
  collapsed: boolean;
}

const ToggleArrow = styled(SquaredButton)<ToggleArrowProps>`
  ${({ collapsed }) => (collapsed ? "transform: rotate(0.5turn)" : "")}
`;

interface BackgroundLoadingInfoProps {
  loadingItems: LoadingInfo[];
  isLoading: boolean;
  dismissAll: () => void;
}

const BackgroundLoadingInfo: FC<BackgroundLoadingInfoProps> = ({
  loadingItems,
  isLoading,
  dismissAll,
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = useCallback(() => setCollapsed(!collapsed), [
    collapsed,
    setCollapsed,
  ]);
  const isActive = loadingItems.length > 0;

  if (!isActive) {
    return null;
  }
  return (
    <BottomRightArea>
      <Grid container>
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <ToggleArrow collapsed={collapsed} onClick={toggleCollapsed}>
                <FaChevronLeft style={{ color: SUCCESS_GREEN }} />
              </ToggleArrow>
            </Grid>
            <Grid item>
              {collapsed && (
                <LoadingSpinnerOrCloseCross
                  isLoading={isLoading}
                  onClose={dismissAll}
                />
              )}
            </Grid>
          </Grid>
        </Grid>
        {!collapsed && (
          <Grid item>
            <LoadingBarArea>
              {loadingItems.map((loadingInfo) => (
                <LoadingInfoDisplay
                  key={loadingInfo.id}
                  loadingInfo={loadingInfo}
                  color={SUCCESS_GREEN}
                />
              ))}
            </LoadingBarArea>
          </Grid>
        )}
      </Grid>
    </BottomRightArea>
  );
};

export default memo(BackgroundLoadingInfo);
