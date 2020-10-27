import useTheme from "@material-ui/core/styles/useTheme";
import React, { FC } from "react";
import { FaTimes } from "react-icons/fa";
import { empty } from "util/function/function-util";
import { CircularProgress } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";

type LoadingSpinnerOrCloseCrossProps = {
  isLoading: boolean;
  onClose: () => void;
};

const LoadingSpinnerOrCloseCross: FC<LoadingSpinnerOrCloseCrossProps> = ({
  isLoading,
  onClose = empty,
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

export default LoadingSpinnerOrCloseCross;
