import { openLink } from "@common/utils/electron";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBook,
  FaEnvelope,
  FaGrinStars,
  FaLightbulb,
  FaQuestionCircle,
} from "react-icons/fa";

import {
  CONTACT_LINK,
  DOCUMENTATION_LINK,
  FEEDBACK_LINK,
  SUGGEST_FEATURE_LINK,
} from "../../constants";
import { useStyles } from "../../hooks/use-styles";

export const HelpButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { t } = useTranslation();
  const classes = useStyles();

  const menuItems = [
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Icon: FaGrinStars,
      label: t("folderDropzone.feedback"),
      link: FEEDBACK_LINK,
    },
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Icon: FaEnvelope,
      label: t("folderDropzone.contactUs"),
      link: CONTACT_LINK,
    },
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Icon: FaLightbulb,
      label: t("folderDropzone.suggestFeature"),
      link: SUGGEST_FEATURE_LINK,
    },
    {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Icon: FaBook,
      label: t("folderDropzone.documentation"),
      link: DOCUMENTATION_LINK,
    },
  ];

  const handleButtonClick = (event: React.MouseEvent): void => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = (): void => {
    setAnchorEl(null);
  };

  const handleItemClick = (link: string): void => {
    openLink(link);
    closeMenu();
  };

  return (
    <Box>
      <Button
        aria-controls="help-menu"
        aria-haspopup="true"
        onClick={handleButtonClick}
        className={classes.headerButton}
      >
        <FaQuestionCircle />
      </Button>
      <Menu
        id="help-menu"
        getContentAnchorEl={null}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        anchorOrigin={{
          horizontal: "right",
          vertical: "top",
        }}
        transformOrigin={{
          horizontal: "right",
          vertical: "bottom",
        }}
      >
        {menuItems.map(
          (
            { label, link, Icon } //eslint-disable-line @typescript-eslint/naming-convention
          ) => (
            <MenuItem
              key={label}
              onClick={() => {
                handleItemClick(link);
              }}
            >
              <ListItemIcon>
                <Icon />
              </ListItemIcon>
              <ListItemText>{label}</ListItemText>
            </MenuItem>
          )
        )}
      </Menu>
    </Box>
  );
};
