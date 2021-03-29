import React, { FC, useState } from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@material-ui/core";
import {
  FaBook,
  FaEnvelope,
  FaGrinStars,
  FaLightbulb,
  FaQuestionCircle,
} from "react-icons/fa";
import { useStyles } from "../../hooks/use-styles";
import {
  CONTACT_LINK,
  DOCUMENTATION_LINK,
  FEEDBACK_LINK,
  SUGGEST_FEATURE_LINK,
} from "../../constants";
import { useTranslation } from "react-i18next";
import { openLink } from "../../util/electron/electron-util";

const HelpButton: FC = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { t } = useTranslation();
  const classes = useStyles();

  const menuItems = [
    {
      label: t("folderDropzone.feedback"),
      Icon: FaGrinStars,
      link: FEEDBACK_LINK,
    },
    {
      label: t("folderDropzone.contactUs"),
      Icon: FaEnvelope,
      link: CONTACT_LINK,
    },
    {
      label: t("folderDropzone.suggestFeature"),
      Icon: FaLightbulb,
      link: SUGGEST_FEATURE_LINK,
    },
    {
      label: t("folderDropzone.documentation"),
      Icon: FaBook,
      link: DOCUMENTATION_LINK,
    },
  ];

  const handleButtonClick = (event): void => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = (): void => setAnchorEl(null);

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
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {menuItems.map(({ label, link, Icon }) => (
          <MenuItem key={label} onClick={() => handleItemClick(link)}>
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

export default HelpButton;
