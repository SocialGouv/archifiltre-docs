import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import React, { FC } from "react";
import { FaCheckCircle } from "react-icons/fa";

type LoadingSpinnerProps = {
  loaderText: string;
  isLoading?: boolean;
};

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ loaderText, isLoading }) => (
  <Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexDirection="column"
  >
    {isLoading ? (
      <CircularProgress />
    ) : (
      <IconButton color="primary">
        <FaCheckCircle />
      </IconButton>
    )}
    <div>{loaderText}</div>
  </Box>
);

export default LoadingSpinner;
