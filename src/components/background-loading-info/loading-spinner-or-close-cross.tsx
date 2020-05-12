import useTheme from "@material-ui/core/styles/useTheme";
import React, { FC, memo } from "react";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { empty } from "util/function/function-util";
import Spinner from "../common/spinner";
import SquaredButton from "./squared-button";

const Loader = memo(styled.div`
  width: 37px;
  height: 37px;
  padding: 10px 10px 10px 10px;
  box-sizing: border-box;
`);

interface LoadingSpinnerOrCloseCrossProps {
  isLoading: boolean;
  onClose: () => void;
}

const LoadingSpinnerOrCloseCross: FC<LoadingSpinnerOrCloseCrossProps> = ({
  isLoading,
  onClose = empty,
}) => {
  const theme = useTheme();
  if (isLoading) {
    return (
      <Loader>
        <Spinner color={theme.palette.secondary.main} />
      </Loader>
    );
  }
  return (
    <SquaredButton onClick={onClose} theme={theme}>
      <FaTimes style={{ color: theme.palette.secondary.main }} />
    </SquaredButton>
  );
};

export default LoadingSpinnerOrCloseCross;
