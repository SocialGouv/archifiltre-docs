import { createStyles, Link } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { shell } from "electron";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  FaEnvelope,
  FaGlobeAmericas,
  FaGrinStars,
  FaInfo,
  FaQuestionCircle,
} from "react-icons/fa";
import { versionName } from "version";
import packageJson from "../../../../package.json";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";

const useLocalStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      paddingRight: theme.spacing(1),
    },
  })
);

const aboutItems = [
  {
    link: `${ARCHIFILTRE_SITE_URL}/produit#${packageJson.version.replace(
      /\./g,
      ""
    )}`,
    Icon: FaGlobeAmericas,
    label: "settingsModal.website",
  },
  {
    link: "https://github.com/SocialGouv/archifiltre/wiki/Wiki-Archifiltre",
    Icon: FaQuestionCircle,
    label: "settingsModal.wiki",
  },
  {
    link: "https://bit.ly/315pAd8",
    Icon: FaGrinStars,
    label: "folderDropzone.feedback",
  },
  {
    link: "mailto:archifiltre@sg.social.gouv.fr",
    Icon: FaEnvelope,
    label: "folderDropzone.contactUs",
  },
];

const About: FC = () => {
  const { t } = useTranslation();
  const classes = useLocalStyles();

  const onClick = (event, link) => {
    event.preventDefault();
    shell.openExternal(link);
  };

  return (
    <Box paddingTop={1}>
      <Box display="flex" pb={1}>
        <FaInfo className={classes.icon} />
        {`v${packageJson.version} ${versionName}`}
      </Box>
      {aboutItems.map(({ link, Icon, label }) => (
        <Box pb={1} key={label}>
          <Link
            component="button"
            variant="h4"
            onClick={(event) => onClick(event, link)}
          >
            <Icon className={classes.icon} />
            {t(label)}
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default About;
