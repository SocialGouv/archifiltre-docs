import { Badge } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaFlag, FaInfoCircle, FaLock } from "react-icons/fa";

import { useAutoUpdateContext } from "../../../context/auto-update-context";

export interface ModalMenuProps {
  selectedItem: number;
  setSelectedItem: (selectedItem: number) => void;
}

export const ModalMenu: React.FC<ModalMenuProps> = ({ selectedItem, setSelectedItem }) => {
  const { t } = useTranslation();
  const { updateInfo } = useAutoUpdateContext();
  const menuOptions = [
    {
      icon: <FaFlag />,
      label: t("settingsModal.language"),
    },
    {
      icon: <FaLock />,
      label: t("settingsModal.privacy"),
    },
    {
      icon: (
        <Badge color="error" overlap="rectangular" variant="dot" invisible={!updateInfo}>
          <FaInfoCircle />
        </Badge>
      ),
      label: t("settingsModal.about"),
    },
  ];

  return (
    <List disablePadding>
      {menuOptions.map(({ label, icon }, index) => (
        <ListItem
          button
          key={index}
          onClick={() => {
            setSelectedItem(index);
          }}
          selected={index === selectedItem}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} />
        </ListItem>
      ))}
    </List>
  );
};
