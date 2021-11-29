import Grid from "@material-ui/core/Grid";
import { HelpTooltip } from "components/common/help-tooltip";
import BoundaryDate from "components/main-space/workspace/general/session-info/boundary-date";
import dateFormat from "dateformat";
import React from "react";
import { useTranslation } from "react-i18next";

export interface FolderBoundaryDatesProps {
    minLastModifiedTimestamp: number;
    medianLastModifiedTimestamp: number;
    maxLastModifiedTimestamp: number;
}

const FolderBoundaryDates: React.FC<FolderBoundaryDatesProps> = ({
    minLastModifiedTimestamp,
    medianLastModifiedTimestamp,
    maxLastModifiedTimestamp,
}) => {
    const { t } = useTranslation();

    return (
        <Grid container spacing={2}>
            <Grid item>
                <BoundaryDate
                    title={t("report.minimum")}
                    content={dateFormat(minLastModifiedTimestamp, "dd/mm/yyyy")}
                />
            </Grid>
            <Grid item>
                <BoundaryDate
                    title={
                        <>
                            {t("report.median")}&nbsp;
                            <HelpTooltip
                                tooltipText={t("report.medianExplanation")}
                            />
                        </>
                    }
                    content={dateFormat(
                        medianLastModifiedTimestamp,
                        "dd/mm/yyyy"
                    )}
                />
            </Grid>
            <Grid item>
                <BoundaryDate
                    title={t("report.maximum")}
                    content={dateFormat(maxLastModifiedTimestamp, "dd/mm/yyyy")}
                />
            </Grid>
        </Grid>
    );
};

export default FolderBoundaryDates;
