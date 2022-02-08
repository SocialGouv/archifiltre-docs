import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { InfoBoxPaper } from "../../../common/info-box-paper";

export interface TabContentHeaderProps {
  title: string;
}

export const TabContentHeader: React.FC<TabContentHeaderProps> = ({
  children,
  title,
}) => {
  const { t } = useTranslation();
  const [isContentHidden, setIsContentHidden] = useState(false);
  const toggleIsContentHidden = useCallback(() => {
    setIsContentHidden(!isContentHidden);
  }, [setIsContentHidden, isContentHidden]);

  return (
    <InfoBoxPaper>
      <Box display="flex" flexDirection="column">
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h3">{title}</Typography>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={toggleIsContentHidden}
                startIcon={isContentHidden ? <FaEye /> : <FaEyeSlash />}
              >
                {isContentHidden ? t("workspace.show") : t("workspace.hide")}
              </Button>
            </Box>
          </Box>
        </Box>
        <Box display={isContentHidden ? "none" : "initial"} height="11rem">
          {children}
        </Box>
      </Box>
    </InfoBoxPaper>
  );
};
