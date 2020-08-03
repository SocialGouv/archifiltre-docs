import React, { FC } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { useTranslation } from "react-i18next";
import { FaFlag, FaInfoCircle, FaLock } from "react-icons/fa";

type ModalMenuProps = {
  selectedItem: number;
  setSelectedItem: (selectedItem: number) => void;
};

const ModalMenu: FC<ModalMenuProps> = ({ selectedItem, setSelectedItem }) => {
  const { t } = useTranslation();
  const menuOptions = [
    {
      label: t("settingsModal.language"),
      icon: <FaFlag />,
    },
    {
      label: t("settingsModal.privacy"),
      icon: <FaLock />,
    },
    {
      label: t("settingsModal.about"),
      icon: <FaInfoCircle />,
    },
  ];

  return (
    <List disablePadding>
      {menuOptions.map(({ label, icon }, index) => (
        <ListItem
          button
          key={index}
          onClick={() => setSelectedItem(index)}
          selected={index === selectedItem}
        >
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={label} />
        </ListItem>
      ))}
    </List>
  );
};

export default ModalMenu;
