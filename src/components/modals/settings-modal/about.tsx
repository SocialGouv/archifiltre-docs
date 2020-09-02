import { Link } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { shell } from "electron";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { FaGlobeAmericas, FaInfo, FaQuestionCircle } from "react-icons/fa";
import { versionName } from "version";
import { version } from "../../../../package.json";

const About: FC = () => {
  const { t } = useTranslation();

  const onSiteClick = (event) => {
    event.preventDefault();
    shell.openExternal(`${ARCHIFILTRE_SITE_URL}/produit#${version}`);
  };

  const onWikiClick = (event) => {
    event.preventDefault();
    shell.openExternal(
      "https://github.com/SocialGouv/archifiltre/wiki/Wiki-Archifiltre"
    );
  };

  return (
    <Box paddingTop={1}>
      <Box display="flex" pb={1}>
        <FaInfo />
        &nbsp;{`v${version} ${versionName}`}
      </Box>
      <Box pb={1}>
        <Link component="button" variant="h4" onClick={onSiteClick}>
          <FaGlobeAmericas />
          &nbsp;{t("settingsModal.website")}
        </Link>
      </Box>
      <Box>
        <Link component="button" variant="h4" onClick={onWikiClick}>
          <FaQuestionCircle />
          &nbsp;{t("settingsModal.wiki")}
        </Link>
      </Box>
    </Box>
  );
};

export default About;
