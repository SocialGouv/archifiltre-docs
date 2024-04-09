import { openLink } from "@common/utils/electron";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBook, FaEnvelope, FaGrinStars, FaLightbulb, FaQuestionCircle } from "react-icons/fa";

import { CONTACT_LINK, DOCUMENTATION_LINK, FEEDBACK_LINK, SUGGEST_FEATURE_LINK } from "../../constants";
import { useStyles } from "../../hooks/use-styles";

export const HelpButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { t } = useTranslation();
  const classes = useStyles();

  const menuItems = [
    {
      Icon: FaGrinStars,
      label: t("folderDropzone.feedback"),
      link: FEEDBACK_LINK,
    },
    {
      Icon: FaEnvelope,
      label: t("folderDropzone.contactUs"),
      link: CONTACT_LINK,
    },
    {
      Icon: FaLightbulb,
      label: t("folderDropzone.suggestFeature"),
      link: SUGGEST_FEATURE_LINK,
    },
    {
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
        {menuItems.map(({ label, link, Icon }) => (
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
        ))}
      </Menu>
    </Box>
  );
};
