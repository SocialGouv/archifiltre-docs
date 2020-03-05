import { shell } from "electron";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaQuestionCircle } from "react-icons/all";
import ReactTooltip from "react-tooltip";
import styled from "styled-components";

/**
 * Opens the wiki in a browser
 * @param event
 */
const onClick = event => {
  event.preventDefault();
  shell.openExternal(
    "https://github.com/SocialGouv/archifiltre/wiki/Wiki-Archifiltre"
  );
};

const QuestionCircle = styled(FaQuestionCircle)`
  margin-left: 5px;
  vertical-align: middle;
  color: dimgrey;
  cursor: pointer;
`;

export const HelpLink: FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <QuestionCircle
        onClick={onClick}
        data-tip={t("header.help")}
        data-for="help-button"
      />
      <ReactTooltip place="bottom" id="help-button" />
    </>
  );
};
