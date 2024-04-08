import { openLink } from "@common/utils/electron";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import createStyles from "@material-ui/core/styles/createStyles";
import type { Theme } from "@material-ui/core/styles/createTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  FaBook,
  FaEnvelope,
  FaGlobeAmericas,
  FaGrinStars,
  FaInfo,
} from "react-icons/fa";

import {
  ARCHIFILTRE_CONTACT_EMAIL,
  ARCHIFILTRE_SITE_URL,
  CONTACT_LINK,
  DOCUMENTATION_LINK,
  FEEDBACK_LINK,
} from "../../../constants";
import { useAutoUpdateContext } from "../../../context/auto-update-context";
import { version, versionName } from "../../../version";

const useLocalStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      paddingRight: theme.spacing(1),
    },
  })
);

const aboutItems = [
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: FaGlobeAmericas,
    id: "website",
    label: "settingsModal.website",
    link: `${ARCHIFILTRE_SITE_URL}/docs`,
  },
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: FaBook,
    id: "wiki",
    label: "settingsModal.wiki",
    link: DOCUMENTATION_LINK,
  },
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: FaGrinStars,
    id: "feedback",
    label: "folderDropzone.feedback",
    link: FEEDBACK_LINK,
  },
  {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Icon: FaEnvelope,
    id: "contact",
    label: "settingsModal.contactUs",
    link: CONTACT_LINK,
  },
];

export const About: React.FC = () => {
  const { t } = useTranslation();
  const classes = useLocalStyles();
  const { updateInfo, doUpdate } = useAutoUpdateContext();

  const onClick = (event: React.MouseEvent, link: string) => {
    event.preventDefault();
    openLink(link);
  };

  /* eslint-disable @typescript-eslint/naming-convention */
  return (
    <Box paddingTop={1}>
      <Box display="flex" pb={1}>
        <FaInfo className={classes.icon} />
        {`v${version} ${versionName}`}
        {updateInfo && (
          <>
            {"  "}
            <Link
              onClick={() => {
                doUpdate();
              }}
              variant="caption"
              component="caption"
              color="error"
              style={{ cursor: "pointer" }}
            >
              (Download new version {updateInfo.version})
            </Link>
          </>
        )}
      </Box>

      {aboutItems.map(({ id, link, Icon, label }) => (
        <Box pb={1} key={id}>
          <Link
            component="button"
            variant="h4"
            onClick={(event) => {
              onClick(event, link);
            }}
            className={"text-left"}
          >
            <Icon className={classes.icon} />
            {t(label, { email: ARCHIFILTRE_CONTACT_EMAIL })}
          </Link>
        </Box>
      ))}
    </Box>
  );
};
