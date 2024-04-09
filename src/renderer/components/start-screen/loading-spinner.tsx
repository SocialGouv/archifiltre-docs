import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

export interface LoadingSpinnerProps {
  isLoading?: boolean;
  loaderText: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loaderText, isLoading }) => (
  <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
    {isLoading ? (
      <CircularProgress />
    ) : (
      <IconButton color="primary" size="large">
        <FaCheckCircle />
      </IconButton>
    )}
    <div>{loaderText}</div>
  </Box>
);
