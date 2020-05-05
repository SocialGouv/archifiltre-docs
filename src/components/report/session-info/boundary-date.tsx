import React, { FC } from "react";
import Box from "@material-ui/core/Box";
import TextInfo, { TextSize } from "../../text/text-info";

interface BoundaryDateProps {
  title: string;
  content: string;
}

const BoundaryDate: FC<BoundaryDateProps> = ({ title, content }) => (
  <Box display="flex" flexDirection="column">
    <Box>
      <TextInfo size={TextSize.SMALL} uppercase={true}>
        {title}
      </TextInfo>
    </Box>
    <Box>
      <TextInfo bold={false}>{content}</TextInfo>
    </Box>
  </Box>
);

export default BoundaryDate;
