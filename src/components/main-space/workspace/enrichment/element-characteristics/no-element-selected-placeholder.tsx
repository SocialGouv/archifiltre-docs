import React, { FC } from "react";
import Box from "@material-ui/core/Box";
import { FaHandPointer } from "react-icons/fa";

type NoElementSelectedPlaceholderProps = {
  title: string;
};

const NoElementSelectedPlaceholder: FC<NoElementSelectedPlaceholderProps> = ({
  title,
}) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    textAlign="center"
    alignItems="center"
    padding="30px"
  >
    <FaHandPointer style={{ paddingBottom: "5px" }} />
    {title}
  </Box>
);

export default NoElementSelectedPlaceholder;
