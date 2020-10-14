import { Divider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import EllipsisText from "components/main-space/workspace/enrichment/tags/ellipsis-text";
import { remote, shell } from "electron";
import path from "path";
import { getPreviousSessions } from "persistence/previous-sessions";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBook,
  FaCog,
  FaEnvelope,
  FaFolderOpen,
  FaPlus,
  FaGrinStars,
  FaSyncAlt,
} from "react-icons/fa";

const onFeedbackClick = () => {
  shell.openExternal("https://bit.ly/315pAd8");
};

const onContactClick = () => {
  shell.openExternal("mailto:archifiltre@sg.social.gouv.fr");
};

const onDocumentationClick = () => {
  shell.openExternal(
    "https://github.com/SocialGouv/archifiltre/wiki/Wiki-Archifiltre"
  );
};

type StartScreenSidebarProps = {
  hasPreviousSession: boolean;
  reloadPreviousSession: () => void;
  openModal: () => void;
  loadPath: (path: string) => void;
  isLoading: boolean;
};

const StartScreenSidebar: FC<StartScreenSidebarProps> = ({
  hasPreviousSession,
  reloadPreviousSession,
  openModal,
  loadPath,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [previousSessions, setPreviousSessions] = useState<string[]>([]);

  const onNewDirectoryClick = useCallback(async () => {
    const path = await remote.dialog.showOpenDialog({
      properties: ["openDirectory"],
    });
    loadPath(path.filePaths[0]);
  }, [loadPath]);

  useEffect(() => {
    const storedPreviousSessions = getPreviousSessions();
    setPreviousSessions(storedPreviousSessions);
  }, [setPreviousSessions]);

  return (
    <Box display="flex" flexDirection="column" height="100%" maxWidth={250}>
      <Box>
        <List component="nav">
          <ListItem button onClick={onNewDirectoryClick} disabled={isLoading}>
            <ListItemIcon>
              <FaPlus />
            </ListItemIcon>
            <ListItemText primary={t("folderDropzone.newDirectory")} />
          </ListItem>
          {hasPreviousSession && (
            <ListItem
              button
              onClick={reloadPreviousSession}
              disabled={isLoading}
            >
              <ListItemIcon>
                <FaSyncAlt />
              </ListItemIcon>
              <ListItemText
                primary={t("header.loadPreviousSessionButtonLabel")}
              />
            </ListItem>
          )}
          <Divider />
        </List>
      </Box>
      <Box overflow="auto">
        <List component="nav">
          {previousSessions.map((previousDirectory) => (
            <Tooltip title={previousDirectory} key={previousDirectory}>
              <ListItem
                button
                onClick={() => loadPath(previousDirectory)}
                disabled={isLoading}
              >
                <ListItemIcon>
                  <FaFolderOpen />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <EllipsisText maxWidth={150} displayTooltip={false}>
                      {path.parse(previousDirectory).base}
                    </EllipsisText>
                  }
                />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>
      <Box flex={1} />
      <Box>
        <Divider />
        <List component="nav">
          <ListItem button onClick={openModal}>
            <ListItemIcon>
              <FaCog />
            </ListItemIcon>
            <ListItemText primary={t("settingsModal.title")} />
          </ListItem>
          <ListItem button onClick={onFeedbackClick}>
            <ListItemIcon>
              <FaGrinStars />
            </ListItemIcon>
            <ListItemText primary={t("folderDropzone.feedback")} />
          </ListItem>
          <ListItem button onClick={onDocumentationClick}>
            <ListItemIcon>
              <FaBook />
            </ListItemIcon>
            <ListItemText primary={t("folderDropzone.documentation")} />
          </ListItem>
          <ListItem button onClick={onContactClick}>
            <ListItemIcon>
              <FaEnvelope />
            </ListItemIcon>
            <ListItemText primary={t("folderDropzone.contactUs")} />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default StartScreenSidebar;
