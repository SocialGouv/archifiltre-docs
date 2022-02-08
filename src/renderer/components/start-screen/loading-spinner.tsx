import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export interface LoadingSpinnerProps {
  loaderText: string;
  isLoading?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  loaderText,
  isLoading,
}) => (
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
