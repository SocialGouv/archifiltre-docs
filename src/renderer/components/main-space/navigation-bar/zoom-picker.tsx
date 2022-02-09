import { MenuItem } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import type { ButtonProps } from "@material-ui/core/Button";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import { round } from "lodash";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch, FaSearchMinus, FaSearchPlus } from "react-icons/fa";

import type { AnyFunction } from "../../../utils/function/function-util";
import { ZOOM_SPEED } from "../icicle/icicle-main";
import { useZoomContext } from "../workspace/zoom-provider";
import { ZoomPickerOptionItem } from "./zoom-picker-option-item";

export const ZoomPicker: React.FC = () => {
  const { zoomIn, zoomOut, resetZoom, ratio } = useZoomContext();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick: ButtonProps["onClick"] = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const withHandleClose =
    (callback: AnyFunction) =>
    (...args: unknown[]) => {
      handleClose();
      callback(...args);
    };

  const onZoomIn = () => {
    zoomIn(null, ZOOM_SPEED);
  };
  const onZoomOut = () => {
    zoomOut(null, ZOOM_SPEED);
  };

  const options = [
    {
      icon: <FaSearchPlus />,
      label: t("workspace.zoomIn"),
      onClick: withHandleClose(onZoomIn),
    },
    {
      icon: <FaSearchMinus />,
      label: t("workspace.zoomOut"),
      onClick: withHandleClose(onZoomOut),
    },
    {
      icon: <FaSearch />,
      label: t("workspace.resetZoom"),
      onClick: withHandleClose(resetZoom),
    },
  ];

  const title = `${t("workspace.currentZoom")} : x${round(ratio, 2)}`;

  return (
    <Box>
      <Button
        variant="outlined"
        disableElevation={true}
        color="secondary"
        size="small"
        onClick={handleClick}
        startIcon={<FaSearchPlus />}
      >
        {title}
      </Button>
      <Menu
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
      >
        {options.map(({ icon, label, onClick }) => (
          <MenuItem key={`displayed-${label}`} onClick={onClick}>
            <ZoomPickerOptionItem icon={icon} label={label} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
