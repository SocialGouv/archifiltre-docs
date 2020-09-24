import { Divider } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Tooltip from "@material-ui/core/Tooltip";
import EllipsisText from "components/main-space/workspace/enrichment/tags/ellipsis-text";
import { shell } from "electron";
import { getPreviousSessions } from "persistence/previous-sessions";
import React, { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { remote } from "electron";
import {
  FaBook,
  FaCog,
  FaEnvelope,
  FaFolderOpen,
  FaPlus,
  FaQuestionCircle,
  FaSyncAlt,
} from "react-icons/fa";
import path from "path";

const onFaqClick = () => {
  shell.openExternal(`${ARCHIFILTRE_SITE_URL}/faq`);
};

const onContactClick = () => {
  shell.openExternal("mailto:archifiltre@sg.social.gouv.fr");
};

const onDocumentationClick = () => {
  shell.openExternal(
    "https://github.com/SocialGouv/archifiltre/wiki/Wiki-Archifiltre"
  );
};

type FolderDropzoneSidebarProps = {
  hasPreviousSession: boolean;
  reloadPreviousSession: () => void;
  openModal: () => void;
  loadPath: (path: string) => void;
};

const FolderDropzoneSidebar: FC<FolderDropzoneSidebarProps> = ({
  hasPreviousSession,
  reloadPreviousSession,
  openModal,
  loadPath,
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
          <ListItem button onClick={onNewDirectoryClick}>
            <ListItemIcon>
              <FaPlus />
            </ListItemIcon>
            <ListItemText primary={t("folderDropzone.newDirectory")} />
          </ListItem>
          {hasPreviousSession && (
            <ListItem button onClick={reloadPreviousSession}>
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
              <ListItem button onClick={() => loadPath(previousDirectory)}>
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
          <ListItem button onClick={onFaqClick}>
            <ListItemIcon>
              <FaQuestionCircle />
            </ListItemIcon>
            <ListItemText primary={t("folderDropzone.faq")} />
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

export default FolderDropzoneSidebar;
