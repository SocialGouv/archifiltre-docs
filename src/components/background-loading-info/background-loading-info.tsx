import useTheme from "@material-ui/core/styles/useTheme";
import React, { FC, memo, useCallback, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import styled from "styled-components";
import { LoadingInfo } from "reducers/loading-info/loading-info-types";
import LoadingInfoDisplay from "./loading-info-display";
import LoadingSpinnerOrCloseCross from "./loading-spinner-or-close-cross";
import Grid from "@material-ui/core/Grid";
import { IconButton } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";

const BottomLeftArea = styled(Card)`
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  z-index: 2;
`;

const LoadingBarArea = memo(styled.div`
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
`);

type ToggleArrowProps = {
  collapsed: string;
};

const ToggleArrow = styled(IconButton)<ToggleArrowProps>(({ collapsed }) => ({
  transform: collapsed === "true" ? "rotate(0.5turn)" : undefined,
}));

type BackgroundLoadingInfoProps = {
  loadingItems: LoadingInfo[];
  isLoading: boolean;
  dismissAll: () => void;
};

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
              <Box p={1}>
                <ToggleArrow
                  size="small"
                  collapsed={collapsed.toString()}
                  onClick={toggleCollapsed}
                >
                  <FaChevronLeft
                    style={{ color: theme.palette.secondary.main }}
                  />
                </ToggleArrow>
              </Box>
            </Grid>
            <Grid item>
              {collapsed && (
                <Box p={1}>
                  <LoadingSpinnerOrCloseCross
                    isLoading={isLoading}
                    onClose={dismissAll}
                  />
                </Box>
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
