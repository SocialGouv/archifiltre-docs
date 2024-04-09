import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import noop from "lodash/noop";
import React from "react";
import { FaTimes } from "react-icons/fa";

export interface LoadingSpinnerOrCloseCrossProps {
  isLoading: boolean;
  onClose: () => void;
}

export const LoadingSpinnerOrCloseCross: React.FC<LoadingSpinnerOrCloseCrossProps> = ({
  isLoading,
  onClose = noop,
}) => {
  const theme = useTheme();
  if (isLoading) {
    return (
      <IconButton size="small">
        <CircularProgress color="secondary" size={18} thickness={5} />
      </IconButton>
    );
  }
  return (
    <IconButton size="small" onClick={onClose}>
      <FaTimes style={{ color: theme.palette.secondary.main }} />
    </IconButton>
  );
};
