import { createStyles, Link } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBook,
  FaEnvelope,
  FaGlobeAmericas,
  FaGrinStars,
  FaInfo,
} from "react-icons/fa";
import { versionName } from "version";
import packageJson from "../../../../package.json";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import {
  ARCHIFILTRE_CONTACT_EMAIL,
  CONTACT_LINK,
  DOCUMENTATION_LINK,
  FEEDBACK_LINK,
} from "../../../constants";
import { openLink } from "util/electron/electron-util";

const useLocalStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      paddingRight: theme.spacing(1),
    },
  })
);

const aboutItems = [
  {
    id: "website",
    link: `${ARCHIFILTRE_SITE_URL}/produit#${packageJson.version.replace(
      /\./g,
      ""
    )}`,
    Icon: FaGlobeAmericas,
    label: "settingsModal.website",
  },
  {
    id: "wiki",
    link: DOCUMENTATION_LINK,
    Icon: FaBook,
    label: "settingsModal.wiki",
  },
  {
    id: "feedback",
    link: FEEDBACK_LINK,
    Icon: FaGrinStars,
    label: "folderDropzone.feedback",
  },
  {
    id: "contact",
    link: CONTACT_LINK,
    Icon: FaEnvelope,
    label: "settingsModal.contactUs",
  },
];

const About: FC = () => {
  const { t } = useTranslation();
  const classes = useLocalStyles();

  const onClick = (event, link) => {
    event.preventDefault();
    openLink(link);
  };

  return (
    <Box paddingTop={1}>
      <Box display="flex" pb={1}>
        <FaInfo className={classes.icon} />
        {`v${packageJson.version} ${versionName}`}
      </Box>
      {aboutItems.map(({ id, link, Icon, label }) => (
        <Box pb={1} key={id}>
          <Link
            component="button"
            variant="h4"
            onClick={(event) => onClick(event, link)}
          >
            <Icon className={classes.icon} />
            {t(label, { email: ARCHIFILTRE_CONTACT_EMAIL })}
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default About;
