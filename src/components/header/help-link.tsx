import Tooltip from "@material-ui/core/Tooltip";
import { shell } from "electron";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaQuestionCircle } from "react-icons/fa";
import styled from "styled-components";

/**
 * Opens the wiki in a browser
 * @param event
 */
const onClick = (event) => {
  event.preventDefault();
  shell.openExternal(
    "https://github.com/SocialGouv/archifiltre/wiki/Wiki-Archifiltre"
  );
};

const QuestionCircle = styled(FaQuestionCircle)`
  margin-left: 5px;
  vertical-align: middle;
  color: darkgrey;
  cursor: pointer;
  width: 0.8em;
  height: auto;
`;

export const HelpLink: FC = () => {
  const { t } = useTranslation();
  const title = t("header.help");
  return (
    <Tooltip title={title}>
      <span>
        <QuestionCircle onClick={onClick} />
      </span>
    </Tooltip>
  );
};
