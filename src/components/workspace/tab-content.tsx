import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import InfoBoxPaper from "components/info-boxes/common/info-box-paper";
import React, { FC, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type TabContentProps = {
  title: string;
};

const TabContent: FC<TabContentProps> = ({ children, title }) => {
  const { t } = useTranslation();
  const [isContentHidden, setIsContentHidden] = useState(false);
  const toggleIsContentHidden = useCallback(
    () => setIsContentHidden(!isContentHidden),
    [setIsContentHidden, isContentHidden]
  );

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

export default TabContent;
