import useTheme from "@material-ui/core/styles/useTheme";
import withTheme from "@material-ui/core/styles/withTheme";
import React, { FC, memo, useCallback, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import styled from "styled-components";
import { LoadingInfo } from "reducers/loading-info/loading-info-types";
import { ThemedProps } from "../../theme/default-theme";
import LoadingInfoDisplay from "./loading-info-display";
import LoadingSpinnerOrCloseCross from "./loading-spinner-or-close-cross";
import SquaredButton from "./squared-button";
import { Grid, Theme } from "@material-ui/core";
import muiStyled from "@material-ui/core/styles/styled";

const BottomLeftArea = withTheme(styled.div<ThemedProps>`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background-color: white;
  display: flex;
  border-radius: 2px;
  border: ${({ theme }) => `1px solid ${theme.palette.secondary.main}`};
`);

const LoadingBarArea = memo(styled.div`
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
`);

interface ToggleArrowProps {
  collapsed: boolean;
}

const ToggleArrow = muiStyled(SquaredButton)<Theme, ToggleArrowProps>(
  ({ collapsed }) => ({
    transform: collapsed ? "rotate(0.5turn)" : undefined,
  })
);

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
  const theme = useTheme();
  const toggleCollapsed = useCallback(() => setCollapsed(!collapsed), [
    collapsed,
    setCollapsed,
  ]);
  const isActive = loadingItems.length > 0;

  if (!isActive) {
    return null;
  }
  return (
    <BottomLeftArea>
      <Grid container>
        <Grid item>
          <Grid container direction="column">
            <Grid item>
              <ToggleArrow collapsed={collapsed} onClick={toggleCollapsed}>
                <FaChevronLeft
                  style={{ color: theme.palette.secondary.main }}
                />
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
                  color={theme.palette.secondary.main}
                />
              ))}
            </LoadingBarArea>
          </Grid>
        )}
      </Grid>
    </BottomLeftArea>
  );
};

export default memo(BackgroundLoadingInfo);
