import { createStyles, Link } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import type { Theme } from "@material-ui/core/styles/createMuiTheme";
import makeStyles from "@material-ui/core/styles/makeStyles";
import type { FC } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    FaBook,
    FaEnvelope,
    FaGlobeAmericas,
    FaGrinStars,
    FaInfo,
} from "react-icons/fa";
import { openLink } from "util/electron/electron-util";
import { versionName } from "version";

import {
    ARCHIFILTRE_CONTACT_EMAIL,
    CONTACT_LINK,
    DOCUMENTATION_LINK,
    FEEDBACK_LINK,
} from "../../../constants";
import { version } from "../../../version";

const useLocalStyles = makeStyles((theme: Theme) =>
    createStyles({
        icon: {
            paddingRight: theme.spacing(1),
        },
    })
);

const aboutItems = [
    {
        Icon: FaGlobeAmericas,
        id: "website",
        label: "settingsModal.website",
        link: `${ARCHIFILTRE_SITE_URL}/produit#${version.replace(/\./g, "")}`,
    },
    {
        Icon: FaBook,
        id: "wiki",
        label: "settingsModal.wiki",
        link: DOCUMENTATION_LINK,
    },
    {
        Icon: FaGrinStars,
        id: "feedback",
        label: "folderDropzone.feedback",
        link: FEEDBACK_LINK,
    },
    {
        Icon: FaEnvelope,
        id: "contact",
        label: "settingsModal.contactUs",
        link: CONTACT_LINK,
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
                {`v${version} ${versionName}`}
            </Box>
            {aboutItems.map(({ id, link, Icon, label }) => (
                <Box pb={1} key={id}>
                    <Link
                        component="button"
                        variant="h4"
                        onClick={(event) => {
                            onClick(event, link);
                        }}
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
