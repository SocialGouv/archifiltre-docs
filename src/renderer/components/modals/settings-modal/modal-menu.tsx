import { Badge } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React from "react";
import { useTranslation } from "react-i18next";
import { FaFlag, FaInfoCircle, FaLock } from "react-icons/fa";

import { useAutoUpdate } from "../../../context/auto-update-context";

export interface ModalMenuProps {
  selectedItem: number;
  setSelectedItem: (selectedItem: number) => void;
}

export const ModalMenu: React.FC<ModalMenuProps> = ({
  selectedItem,
  setSelectedItem,
}) => {
  const { t } = useTranslation();
  const { updateInfo } = useAutoUpdate();
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
        <Badge color="error" variant="dot" invisible={!updateInfo}>
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
